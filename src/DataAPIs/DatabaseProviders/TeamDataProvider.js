"use strict"

var openDatabase = require("./DatabaseConnector").openDatabase;

function getAllTeams(callback) {
  var db = openDatabase();
  db.all('select teams.ID, teams.name from teams', getTeams);
  function getTeams(err, teams_basic) {
    if(err != null) { callback(err); return; }
    if(teams_basic.length == 0) { callback(err, []); return; }
    var teams_with_players = [];
    var next_team = teams_basic.pop();
    if(teams_basic.length > 0)
      db.all('select players.ID, players.name, players.sex from teamplayers JOIN players ON players.ID = teamplayers.playerID where teamplayers.teamID = $ID', {$ID: next_team.ID},
        function(err, players) { getTeam(err, players, next_team, false); });
    else
      db.all('select players.ID, players.name, players.sex from teamplayers JOIN players ON players.ID = teamplayers.playerID where teamplayers.teamID = $ID', {$ID: next_team.ID},
        function(err, players) { getTeam(err, players, next_team, true); });

    function getTeam(err, players, team, lastTeam) {
      if(err != null) { console.log("errored"); callback(err); return; }
      team.players = players;
      teams_with_players.push(team);
      if(lastTeam)
      {
        callback(err, teams_with_players);
        return;
      }
      var next_team = teams_basic.pop();
      if(teams_basic.length > 0)
        db.all('select players.ID, players.name, players.sex from teamplayers JOIN players ON players.ID = teamplayers.playerID where teamplayers.teamID = $ID', {$ID: next_team.ID},
          function(err, players) { getTeam(err, players, next_team, false); });
      else
        db.all('select players.ID, players.name, players.sex from teamplayers JOIN players ON players.ID = teamplayers.playerID where teamplayers.teamID = $ID', {$ID: next_team.ID},
          function(err, players) { getTeam(err, players, next_team, true); });
    }
  }
}

function getTeamByID(ID, callback){
  var db = openDatabase();
  db.get('select teams.ID, teams.name from teams where ID = $ID', {$ID: ID}, getTeam);
  function getTeam(err, team_basic) {
    if(err != null) { callback(err); return; }
    if(team_basic == null) { callback(err, {}); return; }
    var team = team_basic;
    db.all('select players.ID, players.name, players.sex from teamplayers JOIN players ON players.ID = teamplayers.playerID where teamplayers.teamID = $ID', {$ID: team.ID},getPlayers);
    function getPlayers(err, players) {
      if(err != null) { callback(err); return; }
      team.players = players;
      callback(err, team);
    }
  }
}

function getTeamsByName(name, callback) {
  var db = openDatabase();
  db.all('SELECT * FROM teams where name like \'%' + name + '%\'',
    function(err, rows) { db.close(); callback(err, rows); }
  );
}

function addTeam(name, callback) {
  var db = openDatabase();
  db.run('insert into teams (name) values ($name)', {$name: name}, function(err) {db.close(); callback(err, this.lastID);});
}

function deleteTeam(ID, callback) {
  var db = openDatabase();
  db.run('delete from teams where ID = $id', {$id: ID},
    function(err) {
      db.run('delete from teamplayers where teamID = $id', {$id: ID},
        function(err) {
          db.close();
          callback(err);
        }
      );
    }
  );
}

function deleteAllTeams(callback) {
  var db = openDatabase();
  db.run('delete from teams', 
    function(err) {
      db.run('delete from teamplayers',
        function(err) {
          db.close();
          callback(err);
        }
      );
    }
  );
}

module.exports = {
  getAll : getAllTeams,
  getByID : getTeamByID,
  getByName : getTeamsByName,
  add : addTeam,
  deleteByID : deleteTeam,
  deleteAll : deleteAllTeams
}
