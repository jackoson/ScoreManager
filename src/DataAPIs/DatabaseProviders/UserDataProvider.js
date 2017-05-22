"use strict"

var crypto = require('crypto');
var openDatabase = require("./DatabaseConnector").openDatabase;

function getAllUsers(callback) {
    var db = openDatabase();
    db.get('select * from users', function(err, data) { db.close(); callback(err, data); });
}

function getUserByID(id, callback) {
    var db = openDatabase();
    db.get('select * from users where ID = $ID', {$ID: id}, function(err, data) { db.close(); callback(err, data); });
}

function getUserByUsername(username, callback) {
    var db = openDatabase();
    db.get('select * from users where username = $username', {$username: username}, function(err, data) { db.close(); callback(err, data); });
}

function AuthenticateUser(username, password, callback) {
  getUserByUsername(username, getUsername);
  function getUsername(err, data) {
    if(err != null) {
      callback(false);
    } else {
      var hashfunction = crypto.createHash('sha256');
      hashfunction.update(password);
      hashfunction.update(data.passwordSalt);
      if(data.passwordHash == hashfunction.digest('hex')) {
        callback(true, data.ID);
      } else {
        callback(false);
      }
    }
  }
}

function addUser(user, callback) {
    var db = openDatabase();
    crypto.randomBytes(32, done);
    function done(err, buf) {
      if(err != null) throw Exception("No randomness");
      var salt = buf.toString('hex');
      var hashfunction = crypto.createHash('sha256');
      hashfunction.update(user.password);
      hashfunction.update(salt);
      var hash = hashfunction.digest('hex');
      db.run(
          'insert into users (username, passwordHash, passwordSalt) values ($username, $hash, $salt)',
          {$username: user.username, $hash: hash, $salt: salt},
          function(err) { db.close(); callback(err); }
      );
    }
}

function deleteUser(id, callback) {
    var db = openDatabase();
    db.run('delete from users where ID = $ID', {$ID: id}, function(err) { db.close(); callback(err); });
}

function deleteAllUsers(callback) {
    var db = openDatabase();
    db.run('delete from users', function(err) { db.close(); callback(err); });
}

module.exports = {
  getAll : getAllUsers,
  getByID : getUserByID,
  getByUsername : getUserByUsername,
  add : addUser,
  deleteByID : deleteUser,
  deleteAll : deleteAllUsers,
  Authenticate : AuthenticateUser
}
