"use strict"

var crypto = require('crypto');
var openDatabase = require("./DatabaseConnector").openDatabase;
var db = openDatabase();

function getAllSessions(callback) {
    db.get('select * from sessions', callback);
}

function getSessionByID(id, callback) {
    db.get('select * from sessions where ID = $ID', {$ID: id}, callback);
}

function updateSessionExpiration(id, callback) {
    db.get('update sessions set created = $datetime where ID = $ID', {$ID: id, $datetime: new Date().getTime()}, callback);
}

function addSession(userID, callback) {
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
            callback(err, sessionID);
        }
    }
}

function addSessionUser(sessionid, userid, callback) {
  db.get('update sessions set userID = $userid where ID = $sessionid', {$sessionid: sessionid, $userid: userid}, callback );
}

function removeSessionUser(sessionid, callback) {
  db.get('update sessions set userID = null where ID = $sessionid', {$sessionid: sessionid}, callback);
}

function deleteSession(id, callback) {
    db.run('delete from sessions where ID = $ID', {$ID: id}, callback);
}

function deleteAllSessions(callback) {
    db.run('delete from sessions', callback);
}

function deleteOldSessions(time) {
    db.run('delete from sessions where created <= $time', {$time: time});
}

module.exports = {
  getAll : getAllSessions,
  getByID : getSessionByID,
  add : addSession,
  deleteByID : deleteSession,
  deleteAll : deleteAllSessions,
  deleteOldSessions : deleteOldSessions,
  addSessionUser : addSessionUser,
  removeSessionUser : removeSessionUser,
  updateSessionExpiration : updateSessionExpiration
}
