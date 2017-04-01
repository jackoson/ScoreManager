"use strict"

var openDatabase = require("./DatabaseConnector").openDatabase;

function getAllMatches(callback) {
  var db = openDatabase();
  db.all('select ID, datetime, type from matches', getMatches);
  function getMatches(err, matches_basic) {
    if(err != null) { callback(err); return; }
    if(matches_basic.length == 0) { callback(err, []); return; }
    var matches_with_opponents = [];
    var next_match = matches_basic.pop();
    if(matches_basic.length > 0)
      db.all('select opponents.ID, opponents.setsWon from opponents where opponents.matchID = $ID', {$ID: next_match.ID},
        function(err, opponents) { getOpponents(err, opponents, next_match, false); });
    else
      db.all('select opponents.ID, opponents.setsWon from opponents where opponents.matchID = $ID', {$ID: next_match.ID},
        function(err, opponents) { getOpponents(err, opponents, next_match, true); });

    function getOpponents(err, opponents_basic, match, lastMatch) {
      if(err != null) { console.log("couldn't get match"); callback(err); return; }
      if(opponents_basic.length != 2) { callback("ERROR: match with "+opponents_basic.length+" opponents."); return; }
      var opponents_with_players = [];

      var next_opponent = opponents_basic.pop();
      if(opponents_basic.length > 0)
        db.all('select ID, playerID from matchplayers where opponentID = $ID', {$ID: next_opponent.ID},
          function(err, players) { getPlayers(err, players, next_opponent, false); });
      else
        db.all('select ID, playerID from matchplayers where opponentID = $ID', {$ID: next_opponent.ID},
          function(err, players) { getPlayers(err, players, next_opponent, true); });

      function getPlayers(err, players, opponent, lastOpponent) {
        if(err != null) { console.log("couldn't get players"); callback(err); return; }
        if(players.length == 0) { callback("Not enough players on one side."); return; }
        opponent.players = players;
        opponents_with_players.push(opponent);
        if(lastOpponent) {
          match.opponents = opponents_with_players;
          matches_with_opponents.push(match);
          if(lastMatch) {
            callback(err, matches_with_opponents);
            return;
          }
          var next_match = matches_basic.pop();
          if(matches_basic.length > 0)
            db.all('select opponents.ID, opponents.setsWon from opponents where opponents.matchID = $ID', {$ID: next_match.ID},
              function(err, opponents) { getOpponents(err, opponents, next_match, false); });
          else
            db.all('select opponents.ID, opponents.setsWon from opponents where opponents.matchID = $ID', {$ID: next_match.ID},
              function(err, opponents) { getOpponents(err, opponents, next_match, true); });
          return;
        }
        var next_opponent = opponents_basic.pop();
        if(opponents_basic.length > 0)
          db.all('select ID, playerID from matchplayers where opponentID = $ID', {$ID: next_opponent.ID},
            function(err, players) { getPlayers(err, players, next_opponent, false); });
        else
          db.all('select ID, playerID from matchplayers where opponentID = $ID', {$ID: next_opponent.ID},
            function(err, players) { getPlayers(err, players, next_opponent, true); });
      }
    }
  }
}

function getMatchByID(ID, callback){
  var db = openDatabase();
  db.get('select ID, type, datetime, rubberID from matches where ID = $ID', {$ID: ID}, getMatch);
  function getMatch(err, match_basic) {
    if(err != null) { callback(err); return; }
    if(match_basic == null) {callback(err, {}); return;}

    db.all('select opponents.ID, opponents.setsWon from opponents where opponents.matchID = $ID', {$ID: match_basic.ID},
        function(err, opponents) { getOpponents(err, opponents, match_basic); });

    function getOpponents(err, opponents_basic, match) {
      if(opponents_basic.length != 2) { callback("ERROR: match with "+opponents_basic.length+" opponents."); return; }
      var opponents_with_players = [];

      var next_opponent = opponents_basic.pop();
      if(opponents_basic.length > 0)
        db.all('select ID, playerID from matchplayers where opponentID = $ID', {$ID: next_opponent.ID},
          function(err, players) { getPlayers(err, players, next_opponent, false); });
      else
        db.all('select ID, playerID from matchplayers where opponentID = $ID', {$ID: next_opponent.ID},
          function(err, players) { getPlayers(err, players, next_opponent, true); });

      function getPlayers(err, players, opponent, lastOpponent) {
        if(err != null) { console.log("couldn't get players"); callback(err); return; }
        if(players.length == 0) { callback("Not enough players on one side."); return; }
        opponent.players = players;
        opponents_with_players.push(opponent);
        match.opponents = opponents_with_players;
        if(lastOpponent) {
          callback(err, match);
          return;
        }
        var next_opponent = opponents_basic.pop();
        if(opponents_basic.length > 0)
          db.all('select ID, playerID from matchplayers where opponentID = $ID', {$ID: next_opponent.ID},
            function(err, players) { getPlayers(err, players, next_opponent, false); });
        else
          db.all('select ID, playerID from matchplayers where opponentID = $ID', {$ID: next_opponent.ID},
            function(err, players) { getPlayers(err, players, next_opponent, true); });
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
  db.all('select ID from opponents where matchID = $id', {$id: ID}, a);
  function a(err, opponents) {
    if(err!=null) { callback(err); }
    opponents.forEach(b);
    db.run('delete from opponents where matchID = $id', {$id: ID}, callback);
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
