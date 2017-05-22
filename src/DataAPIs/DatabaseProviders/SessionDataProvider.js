"use strict"

var cryto = require('crypto');
var openDatabase = require("./DatabaseConnector").openDatabase;

function getAllSessions(callback) {
    var db = openDatabase();
    db.get('select * from sessions', function(err, data) { db.close(); callback(err, data); });
}

function getSessionByID(id, callback) {
    var db = openDatabase();
    db.get('select * from sessions where ID = $ID', {$ID: id}, function(err, data) { db.close(); callback(err, data); });
}

function addSession(userID, callback) {
    var db = openDatabase();
    var sessionID;
    tryInsert();
    function tryInsert() {
        cryto.randomBytes(16, checkIfUsed);
    }
    function checkIfUsed(err, buff) {
        sessionID = buff.toString('hex');
        db.run(
            'insert into sessions (ID, userID) values ($id, $user)',
            {$id: sessionID, $user: userID},
            checkCallback
        );
    }
    function checkCallback(err) {
        if(err != null) {
            tryInsert();
        } else {
            db.close();
            callback(err, sessionID);
        }
    }
}

function deleteSession(id, callback) {
    var db = openDatabase();
    db.run('delete from sessions where ID = $ID', {$ID: id}, function(err) { db.close(); callback(err); });
}

function deleteAllSessions(callback) {
    var db = openDatabase();
    db.run('delete from sessions', function(err) { db.close(); callback(err); });
}

module.exports = {
  getAll : getAllSessions,
  getByID : getSessionByID,
  add : addSession,
  deleteByID : deleteSession,
  deleteAll : deleteAllSessions
}
