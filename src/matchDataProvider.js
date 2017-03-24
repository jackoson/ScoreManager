"use strict"
var sqlite3 = require("sqlite3");

function openDatabase() {
  return new sqlite3.Database('../tennis.db');
}

function getAllMatches(callback) {
  var db = openDatabase();
  db.all(`SELECT matches.ID, matches.type, matches.datetime, matchplayers.playerID, matchplayers.setsWon
            FROM matches JOIN matchplayers ON matches.ID=matchplayers.matchID`,
    function(err, rows) { db.close(); callback(err, rows); }
  );
}

function getMatchByID(ID, callback){
  var db = openDatabase();
  db.get(`SELECT matches.ID, matches.type, matches.datetime, matchplayers.playerID, matchplayers.setsWon
            FROM matches JOIN matchplayers ON matches.ID=matchplayers.matchID where matches.ID = $value`, {$value: ID},
    function(err, row) { db.close(); callback(err, row); }
  );
}

function addMatch(players, type, datetime, callback) {
  if (players.length < 2) { callback("ERROR: Must have at least 2 player for a match"); }
  var db = openDatabase();
  var matchID;
  function addNextPlayer(err) {
    if(err != null || players.length == 0) {
      db.close();
      callback(err);
    }
    else {
      var player = players.pop();
      db.run('insert into matchplayers (matchID, playerID, setsWon) values ($matchID, $playerID, $setsWon)',
        {$matchID: matchID, $playerID: player.id, $setsWon: player.setsWon},addNextPlayer);
    }
  }
  db.run('insert into matches (type, datetime) values ($type, $datetime)', {$type: type, $datetime: datetime},
    function(err){
      matchID = this.lastID;
      addNextPlayer(err);
    });
}

function deleteMatch(ID, callback) {
  var db = openDatabase();
  db.run('delete from matches where ID = $id', {$id: ID},
    function(err) {
      if(err != null) {
        db.close();
        callback(err);
      }
      else {
        db.run('delete from matchplayers where matchID = $id', {$id: ID}, function(err) { db.close(); callback(err); } );
      }
  } );
}

module.exports = {
  getAllMatches : getAllMatches,
  getMatchByID : getMatchByID,
  addMatch : addMatch,
  deleteMatch : deleteMatch
}
