"use strict"

var openDatabase = require("./DatabaseConnector").openDatabase;

function getAllMatches(callback) {
  var db = openDatabase();
  db.all('select ID, type, datetime, rubberID from matches', getMatches);
  function getMatches(err, matches_basic) {
    if(err != null) { callback(err); return; }
    if(matches_basic.length == 0) { callback(err, []); return; }
    var matches_with_opponents = [];
    while(matches_basic.length > 1) {
      populateMatch(false);
    }
    populateMatch(true);
    function populateMatch(lastmatch) {
      var match = matches_basic.pop();
      db.all('select ID, setsWon from opponents where opponents.matchID = $ID', {$ID: match.ID}, _populateMatch);
      function _populateMatch(err, opponents_basic) {
        if(err != null) { callback(err); return; }
        if(opponents_basic.length == 0) { callback("ERROR: No opponents for match."); return; }
        var opponents_with_players = [];
        while(opponents_basic.length > 1) {
          populateOpponent(false);
        }
        populateOpponent(true);
        function populateOpponent(lastOpponent) {
          var _opponent = opponents_basic.pop();
          (function(opponent) {
            db.all('select players.ID, players.name, players.sex from matchplayers JOIN players on players.ID = matchplayers.playerID where matchplayers.opponentID = $ID', {$ID: opponent.ID}, _populateOpponent);
            function _populateOpponent(err, players) {
              if(err != null) { callback(err); return; }
              opponent.players = players;
              opponents_with_players.push(opponent);
              if(lastOpponent) {
                match.opponents = opponents_with_players;
                matches_with_opponents.push(match);
                if(lastmatch)
                  callback(err, matches_with_opponents);
              }
              
            }
          })(_opponent);
        }
      }
    }
  }
}

function getMatchByID(ID, callback){
  var db = openDatabase();
  db.all('select ID, type, datetime, rubberID from matches where ID = $ID', {$ID: ID}, getMatches);
  function getMatches(err, matches_basic) {
    if(err != null) { callback(err); return; }
    if(matches_basic.length == 0) { callback(err, []); return; }
    var matches_with_opponents = [];
    while(matches_basic.length > 1) {
      populateMatch(false);
    }
    populateMatch(true);
    function populateMatch(lastmatch) {
      var match = matches_basic.pop();
      db.all('select ID, setsWon from opponents where opponents.matchID = $ID', {$ID: match.ID}, _populateMatch);
      function _populateMatch(err, opponents_basic) {
        if(err != null) { callback(err); return; }
        if(opponents_basic.length == 0) { callback("ERROR: No opponents for match."); return; }
        var opponents_with_players = [];
        while(opponents_basic.length > 1) {
          populateOpponent(false);
        }
        populateOpponent(true);
        function populateOpponent(lastOpponent) {
          var _opponent = opponents_basic.pop();
          (function(opponent) {
            db.all('select players.ID, players.name, players.sex from matchplayers JOIN players on players.ID = matchplayers.playerID where matchplayers.opponentID = $ID', {$ID: opponent.ID}, _populateOpponent);
            function _populateOpponent(err, players) {
              if(err != null) { callback(err); return; }
              opponent.players = players;
              opponents_with_players.push(opponent);
              if(lastOpponent) {
                match.opponents = opponents_with_players;
                matches_with_opponents.push(match);
                if(lastmatch)
                  callback(err, matches_with_opponents);
              }
              
            }
          })(_opponent);
        }
      }
    }
  }
}

function addMatch(rubber, type, datetime, opponents, callback) {
  var db = openDatabase(); 
  db.run('insert into matches (type, datetime, rubberID) values ($type, $datetime, $rubber)', {$type: type, $datetime: datetime, $rubber: rubber},
    function(err){
      if(err != null) {db.close(); callback(err); return;}
      var matchID = this.lastID;
      addNextOpponent(err);
      function addNextOpponent(err) {
        if(err != null || opponents.length == 0) {
          db.close();
          callback(err, matchID);
          return;
        }
        else {
          var opponent = opponents.pop();
          db.run('insert into opponents (matchID, setsWon) values ($matchID, $setsWon)', {$matchID: matchID, $setsWon: opponent.setsWon},
            function(err) {
              if(err != null) { db.close(); callback(err); return;}
              var opponentID = this.lastID;
              addNextPlayer(err);
              function addNextPlayer(err) {
                if(err != null) {
                  db.close();
                  callback(err, matchID);
                }
                else if(opponent.players.length == 0) {
                  addNextOpponent(err);
                }
                else {
                  var player = opponent.players.pop();
                  db.run('insert into matchplayers (playerID, opponentID) values ($playerID, $opponentID)',
                    {$playerID: player, $opponentID: opponentID},addNextPlayer);
                }
              }
            }); 
        }
      }
    });
}

//doesn't delete components or matchplayers
function deleteMatch(ID, callback) {
  var db = openDatabase();
  db.run('delete from matches where ID = $id', {$id: ID});
  db.all('select from opponents where matchID = $id', {$id: ID}, a);
  function a(err, opponents) {
    opponents.forEach(b);
    db.run('delete from opponents where matchID = $id', {$id: ID});
  }
  function b(opponent) {
    db.run('delete from matchplayers where opponentID = $id', {$id: opponent.ID});
  }
}

function deleteAllMatches(callback) {
  var db = openDatabase();
  db.run('delete from matches');
  db.run('delete from opponents');
  db.run('delete from matchplayers', function(err) { db.close(); callback(err); });
}

module.exports = {
  getAll : getAllMatches,
  getByID : getMatchByID,
  add : addMatch,
  deleteByID : deleteMatch,
  deleteAll : deleteAllMatches
}
