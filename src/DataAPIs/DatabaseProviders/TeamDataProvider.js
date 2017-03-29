"use strict"

var openDatabase = require("./DatabaseConnector").openDatabase;

function getAllTeams(callback) {
  var db = openDatabase();
  db.all(`select teams.ID, teams.name, group_concat(players.name) as teamplayers from teams JOIN teamplayers on teams.ID = teamplayers.teamID
JOIN players ON players.ID = teamplayers.playerID GROUP BY teamplayers.teamID;`,
    function(err, matches) {
      db.close();
      matches.forEach(function(match) {
        var rawScores = match.scores.split(",");
        var scores = [];
        rawScores.forEach(function(player) {
          var rawInfo = player.split(":");
          scores.push( { name: rawInfo[0], setsWon: rawInfo[1] } );
        });
        match.scores = scores;
      });
      callback(err, matches);
    }
  );
}

function getTeamByID(ID, callback){
  var db = openDatabase();
  db.get(`select teams.ID, teams.name, group_concat(players.name) as teamplayers from teams JOIN teamplayers on teams.ID = teamplayers.teamID
JOIN players ON players.ID = teamplayers.playerID where matches.ID = ?;`, ID,
    function(err, match) {
      if(match == null || match.ID == null)
      {
        callback(err, null);
        return;
      }
      db.close();
      
      var rawScores = match.scores.split(",");
      var scores = [];
      rawScores.forEach(function(player) {
        var rawInfo = player.split(":");
        scores.push( { name: rawInfo[0], setsWon: rawInfo[1] } );
      });
      match.scores = scores;
      
      callback(err, match);
    }
  );
}

function getTeamsByName(name, callback) {
  var db = openDatabase();
  db.all('SELECT * FROM teams where name like \'%' + name + '%\'',
    function(err, rows) { db.close(); callback(err, rows); }
  );
}

function addTeam(name, callback) {
  var db = openDatabase();
  db.run('insert into teams (name) values ($name)', {$name: name}, function() {db.close(); callback(err, this.lastID);});
}

function deleteTeam(ID, callback) {
  var db = openDatabase();
  db.run('delete from matches where ID = $id', {$id: ID},
    function(err) {
      db.close();
      callback(err);
    }
  );
}

module.exports = {
  getAll : getAllTeams,
  getByID : getTeamByID,
  getByName : getTeamsByName,
  add : addTeam,
  deleteByID : deleteTeam
}
