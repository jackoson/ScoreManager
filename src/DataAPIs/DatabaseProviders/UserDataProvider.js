"use strict"

var crypto = require('crypto');
var openDatabase = require("./DatabaseConnector").openDatabase;
var db = openDatabase();

function getAllUsers(callback) {
    db.get('select * from users', callback);
}

function getUserByID(id, callback) {
    db.get('select * from users where ID = $ID', {$ID: id}, callback);
}

function getUserByUsername(username, callback) {
    db.get('select * from users where username = $username', {$username: username}, callback);
}

function AuthenticateUser(username, password, callback) {
  getUserByUsername(username, getUsername);
  function getUsername(err, data) {
    if(err != null || data == null) {
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
          {$username: user.username, $hash: hash, $salt: salt},callback);
    }
}

function deleteUser(id, callback) {
    db.run('delete from users where ID = $ID', {$ID: id}, callback);
}

function deleteAllUsers(callback) {
    db.run('delete from users', callback);
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
