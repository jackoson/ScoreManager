"use strict"

var openDatabase = require("./DatabaseConnector").openDatabase;
var db = openDatabase();

function getAllTeams(callback) {
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
      db.all('select teamplayers.ID, players.ID, players.name, players.sex from teamplayers JOIN players ON players.ID = teamplayers.playerID where teamplayers.teamID = $ID', {$ID: next_team.ID},
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
  db.get('select teams.ID, teams.name from teams where ID = $ID', {$ID: ID}, getTeam);
  function getTeam(err, team_basic) {
    if(err != null) { callback(err); return; }
    if(team_basic == null) { callback(err, {}); return; }
    var team = team_basic;
    db.all('select teamplayers.ID, players.ID, players.name, players.sex from teamplayers JOIN players ON players.ID = teamplayers.playerID where teamplayers.teamID = $ID', {$ID: team.ID},getPlayers);
    function getPlayers(err, players) {
      if(err != null) { callback(err); return; }
      team.players = players;
      callback(err, team);
    }
  }
}

function getTeamsByName(name, callback) {
  db.all('SELECT * FROM teams where name like \'%' + name + '%\'',callback);
}

function addTeam(name, callback) {
  db.run('insert into teams (name) values ($name)', {$name: name}, function(err) {callback(err, this.lastID);});
}

function addTeamPlayer(playerID, teamID, callback) {
  db.run('insert into teamplayers (playerID, teamID) values ($playerID, $teamID)', {$playerID: playerID, $teamID: teamID}, function(err) {callback(err, this.lastID);});
}

function deleteTeamPlayerByID(ID, callback) {
  db.run('delete from teamplayers WHERE ID = $ID', {$ID: ID}, function(err) {callback(err, this.lastID);});
}

function getTeamPlayerByID(ID, callback) {
  db.get(`select teamplayers.ID as teamplayerID, players.ID as playerID, players.name as playerName, players.sex as playerSex, teams.ID as teamID, teams.name as teamName from teamplayers
          JOIN players ON players.ID = teamplayers.playerID
          JOIN teams ON teams.ID = teamplayers.teamID
          where teamplayers.ID = $ID`, {$ID: ID}, function(err, rows) { if (err != null) {callback(err);} else if(rows != undefined){callback(err, rows);} else {callback(err, {}) } });
}

function deleteTeamPlayerByID(ID, callback) {
  db.run('delete from teamplayers where ID = $id', {$id: ID}, callback);
}

function deleteTeam(ID, callback) {
  db.run('delete from teams where ID = $id', {$id: ID},
    function(err) {
      db.run('delete from teamplayers where teamID = $id', {$id: ID},callback);
    }
  );
}

function deleteAllTeams(callback) {
  db.run('delete from teams',
    function(err) {
      db.run('delete from teamplayers',callback);
    }
  );
}

module.exports = {
  getAll : getAllTeams,
  getByID : getTeamByID,
  getByName : getTeamsByName,
  add : addTeam,
  deleteByID : deleteTeam,
  deleteAll : deleteAllTeams,
  addTeamPlayer : addTeamPlayer,
  getTeamPlayerByID : getTeamPlayerByID,
  deleteTeamPlayerByID : deleteTeamPlayerByID
}
