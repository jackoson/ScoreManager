"use strict"

var openDatabase = require("./DatabaseConnector").openDatabase;

function getAllUsers(callback) {
    var db = openDatabase();
    db.get('select * from users', function(err, data) { db.close(); callback(err, data); });
}

function getUserByID(id, callback) {
    var db = openDatabase();
    db.get('select * from users where ID = $ID', {$ID: id}, function(err, data) { db.close(); callback(err, data); });
}

function addUser(user, callback) {
    var db = openDatabase();
    var hash = user.password;
    var salt = "sam";
    db.run(
        'insert into users (name, passwordHash, passwordSalt) values ($name, $hash, $salt)',
        {$name: user.name, $hash: hash, $salt: salt},
        function(err) { db.close(); callback(err); }
    );
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
  add : addUser,
  deleteByID : deleteUser,
  deleteAll : deleteAllUsers
}
