"use strict"

var openDatabase = require("./DatabaseConnector").openDatabase;

function getAllTeams(callback) {
  console.log("1");
  var db = openDatabase();
  db.all('select teams.ID, teams.name from teams', getTeams);
  function getTeams(err, teams_basic) {
    console.log(teams_basic);
    if(err != null) { callback(err); return; }
    if(teams_basic.length == 0) { callback(err, []); return; }
    var teams_with_players = [];
    while(teams_basic.length > 1) {
      getTeam(false);
    }
    getTeam(true);

    function getTeam(lastTeam){
      var _team = teams_basic.pop();
      (function(team) {
        console.log(team);
        db.all('select players.ID, players.name, players.sex from teamplayers JOIN players where teamplayers.teamID = $ID', {$ID: team.ID}, _getTeam);
        function _getTeam(err, players) {
          if(err != null) { console.log("errored"); callback(err); return; }
          team.players = players;
          teams_with_players.push(team);
          console.log(team);
          if(lastTeam)
            callback(err, teams_with_players);
        }
      })(_team);
    }
  }
}

function getTeamByID(ID, callback){
  var db = openDatabase();
  db.all('select teams.ID, teams.name from teams where ID = $ID', {$ID: ID}, getTeams);
  function getTeams(err, teams_basic) {
    if(err != null) { callback(err); return; }
    if(teams_basic.length == 0) { callback(err, []); return; }
    var teams_with_players = [];
    while(teams_basic.length > 1) {
      var team = teams_basic.pop();
      db.all('select players.ID, players.name, players.sex from teamplayers JOIN players where teamplayers.teamID = $ID', {$ID: team.ID}, stdTeams);
      function stdTeams(err, players) {
        if(err != null) { callback(err); return; }
        team.players = players;
        teams_with_players.push(team);
      }
    }
    var team = teams_basic.pop();
    db.all('select players.ID, players.name, players.sex from teamplayers JOIN players where teamplayers.teamID = $ID', {$ID: team.ID}, lastTeam);
    function lastTeam(err, players) {
      if(err != null) { callback(err); return; }
      team.players = players;
      teams_with_players.push(team);
      callback(err, teams_with_players);
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
