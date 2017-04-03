"use strict"

var openDatabase = require("./DatabaseConnector").openDatabase;

function getAllPlayers(callback) {
  var db = openDatabase();
  db.all('SELECT * FROM players',
    function(err, rows) { db.close(); callback(err, rows); }
  );
}

function getPlayerByID(ID, callback){
  var db = openDatabase();
  db.get('SELECT players.ID, players.name, players.sex FROM players where ID = $value', {$value: ID}, getPlayer );
  function getPlayer(err, player_basic) {
    if(err != null) { callback(err); return; }
    if(player_basic == null) { callback(err, {}); return; }
    var player = player_basic;
    db.all(`select matchplayers.ID, opponents.setsWon, opponents.ID, matches.datetime, ops.ID as opID, ops.setsWon as opSetsWon from matchplayers
            JOIN opponents ON opponents.ID = matchplayers.opponentID
            JOIN matches ON matches.ID = opponents.matchID
            JOIN opponents ops ON matches.ID = ops.matchID
            where matchplayers.playerID = $ID`, {$ID: player.ID}, getMatches);
    function getMatches(err, matches_basic) {
      if(err != null) { callback(err); return; }
      var matches = {};
      matches_basic.forEach(function(match_data){
        if(matches[match_data.ID] == undefined) { matches[match_data.ID] = {}}
        if(match_data.ID == match_data.opID) {
          matches[match_data.ID].match = match_data;
        } else {
          matches[match_data.ID].opID = match_data.opID;
          matches[match_data.ID].opSetsWon = match_data.opSetsWon;
        }
      });
      matches = Object.keys(matches).map(function(k){
        matches[k].match.opID = matches[k].opID; 
        matches[k].match.opSetsWon = matches[k].opSetsWon;
        return matches[k].match;
      });
      player.matches = matches;
      db.all(`select competitions.ID, competitions.name from matchplayers
            JOIN opponents ON opponents.ID = matchplayers.opponentID
            JOIN matches ON matches.ID = opponents.matchID
            JOIN rubbers ON rubbers.ID = matches.rubberID
            JOIN competitions ON competitions.ID = rubbers.competitionID
            where matchplayers.playerID = $ID`, {$ID: ID}, getTournements);
    }
    function getTournements(err, tournements) {
      if(err != null) { console.log("hi"); callback(err); return; }
      player.tournements = tournements;      
      callback(err, player);
    }
  }
}

function getPlayersByName(name, callback) {
  var db = openDatabase();
  db.all('SELECT * FROM players where name like \'%' + name + '%\'',
    function(err, rows) { db.close(); callback(err, rows); }
  );
}

const female = "f";
const male = "m";
const other = "o";
function getPlayersBySex(sex, callback) {
  var db = openDatabase();
  db.all('SELECT * FROM players where gender = $value', {$value: sex},
    function(err, rows) { db.close(); callback(err, rows); }
  );
}

function addPlayer(name, sex, callback) {
  var db = openDatabase();
  db.run('insert into players (name, sex) values ($name, $sex)', {$name: name, $sex: sex}, 
    function(err) { db.close(); callback(err, this.lastID); }
  );
}

function deletePlayer(ID, callback) {
  var db = openDatabase();
  db.run('delete from players where ID = $id', {$id: ID}, 
    function(err) { db.close(); callback(err); }
  );
}

function deleteAllPlayers(callback) {
  var db = openDatabase();
  db.run('delete from players', 
    function(err) { db.close(); callback(err); }
  );
}

module.exports = {
  getAll : getAllPlayers,
  getByID : getPlayerByID,
  getByName : getPlayersByName,
  getBySex : getPlayersBySex,
  female : female,
  male : male,
  other : other,
  add : addPlayer,
  deleteByID : deletePlayer,
  deleteAll : deleteAllPlayers
}
