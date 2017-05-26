"use strict"

var openDatabase = require("./DatabaseConnector").openDatabase;
var db = openDatabase();

function getAllPlayers(callback) {
  db.all('SELECT * FROM players', callback);
}

var selectOpponentsSQLString = `select opponents.ID as ID, opponents.setsWon, teams.ID as teamID, teams.name as teamName
                                from opponents
                                LEFT JOIN teamplays ON teamplays.opponentID = opponents.ID
                                LEFT JOIN teams ON teams.ID = teamplays.teamID
                                where opponents.matchID = $ID`;
var selectPlayersSQLString = 'select matchplayers.ID, players.ID, players.name from matchplayers JOIN players ON players.ID = matchplayers.playerID where matchplayers.opponentID = $ID';

function getPlayerByID(ID, callback){
  db.get('SELECT players.ID, players.name, players.sex FROM players where ID = $value', {$value: ID}, getPlayer );
  function getPlayer(err, player_basic) {
    if(err != null) { callback(err); return; }
    if(player_basic == null) { callback("Player does not exist."); return; }
    var player = player_basic;
    db.all(`select matches.ID, matches.datetime, matches.type, rubbers.ID as rubberID, competitions.name as competitionName
            from matchplayers
            JOIN opponents ON opponents.ID = matchplayers.opponentID
            JOIN matches ON matches.ID = opponents.matchID
            LEFT JOIN rubbers ON rubbers.ID = matches.rubberID
            LEFT JOIN competitions ON rubbers.competitionID = competitions.ID
            where matchplayers.playerID = $ID`, {$ID: player.ID}, getMatches);
    function getMatches(err, matches_basic) {
      if(err != null) { callback(err); return; }
      if(matches_basic.length == 0) { player.matches = []; request_tournements(); return; }
      var matches_with_opponents = [];
      var next_match = matches_basic.pop();
      if(matches_basic.length > 0)
        db.all(selectOpponentsSQLString, {$ID: next_match.ID},
          function(err, opponents) { getOpponents(err, opponents, next_match, false); });
      else
        db.all(selectOpponentsSQLString, {$ID: next_match.ID},
          function(err, opponents) { getOpponents(err, opponents, next_match, true); });

      function getOpponents(err, opponents_basic, match, lastMatch) {
        if(err != null) { console.log("couldn't get match"); callback(err); return; }
        if(opponents_basic.length != 2) { callback("ERROR: match with "+opponents_basic.length+" opponents."); return; }
        var opponents_with_players = [];

        var next_opponent = opponents_basic.pop();
        if(opponents_basic.length > 0)
          db.all(selectPlayersSQLString, {$ID: next_opponent.ID},
            function(err, players) { getPlayers(err, players, next_opponent, false); });
        else
          db.all(selectPlayersSQLString, {$ID: next_opponent.ID},
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
              player.matches = matches_with_opponents;
              request_tournements();
              return;
            }
            var next_match = matches_basic.pop();
            if(matches_basic.length > 0)
              db.all(selectOpponentsSQLString, {$ID: next_match.ID},
                function(err, opponents) { getOpponents(err, opponents, next_match, false); });
            else
              db.all(selectOpponentsSQLString, {$ID: next_match.ID},
                function(err, opponents) { getOpponents(err, opponents, next_match, true); });
            return;
          }
          var next_opponent = opponents_basic.pop();
          if(opponents_basic.length > 0)
            db.all(selectPlayersSQLString, {$ID: next_opponent.ID},
              function(err, players) { getPlayers(err, players, next_opponent, false); });
          else
            db.all(selectPlayersSQLString, {$ID: next_opponent.ID},
              function(err, players) { getPlayers(err, players, next_opponent, true); });
        }
      }
    }
    function request_tournements() {
      db.all(`select DISTINCT competitions.ID, competitions.name from matchplayers
              JOIN opponents ON opponents.ID = matchplayers.opponentID
              JOIN matches ON matches.ID = opponents.matchID
              JOIN rubbers ON rubbers.ID = matches.rubberID
              JOIN competitions ON competitions.ID = rubbers.competitionID
              where matchplayers.playerID = $ID`, {$ID: ID}, getTournements);
    }
    function getTournements(err, tournements) {
      if(err != null) { callback(err); return; }
      player.tournements = tournements;
      callback(err, player);
    }
  }
}

function getPlayersByName(name, callback) {
  db.all('SELECT * FROM players where name like \'%' + name + '%\'',callback);
}

const female = "f";
const male = "m";
const other = "o";
function getPlayersBySex(sex, callback) {
  db.all('SELECT * FROM players where gender = $value', {$value: sex},callback);
}

function addPlayer(name, sex, callback) {
  db.run('insert into players (name, sex) values ($name, $sex)', {$name: name, $sex: sex},
    function(err) { callback(err, this.lastID); }
  );
}

function deletePlayer(ID, callback) {
  db.run('delete from players where ID = $id', {$id: ID},callback);
}

function deleteAllPlayers(callback) {
  db.run('delete from players',callback);
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
