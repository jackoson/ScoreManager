"use strict"

var crypto = require('crypto');
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
        crypto.randomBytes(32, checkIfUsed);
    }
    function checkIfUsed(err, buff) {
        if(err != null) throw Exception("No randomness");
        sessionID = buff.toString('hex');
        db.run(
            'insert into sessions (ID, userID, created) values ($id, $user, $datetime)',
            {$id: sessionID, $user: userID, $datetime: new Date().getTime()},
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

function addSessionUser(sessionid, userid, callback) {
  var db = openDatabase();
  db.get('update sessions set userID = $userid where ID = $sessionid', {$sessionid: sessionid, $userid: userid}, function(err) { db.close(); callback(err); });
}

function removeSessionUser(sessionid, callback) {
  var db = openDatabase();
  db.get('update sessions set userID = null where ID = $sessionid', {$sessionid: sessionid}, function(err) { db.close(); callback(err); });
}

function deleteSession(id, callback) {
    var db = openDatabase();
    db.run('delete from sessions where ID = $ID', {$ID: id}, function(err) { db.close(); callback(err); });
}

function deleteAllSessions(callback) {
    var db = openDatabase();
    db.run('delete from sessions', function(err) { db.close(); callback(err); });
}

function deleteOldSessions(time) {
    var db = openDatabase();
    db.run('delete from sessions where created <= $time', {$time: time}, function(err) { db.close(); });
}

module.exports = {
  getAll : getAllSessions,
  getByID : getSessionByID,
  add : addSession,
  deleteByID : deleteSession,
  deleteAll : deleteAllSessions,
  addSessionUser : addSessionUser,
  removeSessionUser : removeSessionUser
}
