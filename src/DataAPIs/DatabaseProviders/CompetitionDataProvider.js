"use strict"

var openDatabase = require("./DatabaseConnector").openDatabase;

function getAllCompetitions(callback) {
  var db = openDatabase();
  db.all('select competitions.ID, competitions.name from competitions', getCompetitions);
  function getCompetitions(err, competitions_basic) {
    if(err != null) { callback(err); return; }
    if(competitions_basic.length == 0) { callback(err, []); return; }
    var competitions_with_rubbers = [];
    while(competitions_basic.length > 1) {
      var team = competitions_basic.pop();
      db.all('select ID from rubbers WHERE competitionID = $ID', {$ID: team.ID}, stdCompetitions);
      function stdCompetitions(err, players) {
        if(err != null) { callback(err); return; }
        team.players = players;
        competitions_with_rubbers.push(team);
      }
    }
    var team = competitions_basic.pop();
    db.all('select ID from rubbers WHERE competitionID = $ID', {$ID: team.ID}, lastCompetition);
    function lastCompetition(err, players) {
      if(err != null) { callback(err); return; }
      team.players = players;
      competitions_with_rubbers.push(team);
      callback(err, competitions_with_rubbers);
    }
  }
}

function getCompetitionByID(ID, callback){
  var db = openDatabase();
  db.all('select competitions.ID, competitions.name from competitions where ID = $ID', {$ID: ID}, getCompetitions);
  function getCompetitions(err, competitions_basic) {
    if(err != null) { callback(err); return; }
    if(competitions_basic.length == 0) { callback(err, []); return; }
    var competitions_with_rubbers = [];
    while(competitions_basic.length > 1) {
      var team = competitions_basic.pop();
      db.all('select ID from rubbers WHERE competitionID = $ID', {$ID: team.ID}, stdCompetitions);
      function stdCompetitions(err, players) {
        if(err != null) { callback(err); return; }
        team.players = players;
        competitions_with_rubbers.push(team);
      }
    }
    var team = competitions_basic.pop();
    db.all('select ID from rubbers WHERE competitionID = $ID', {$ID: team.ID}, lastCompetition);
    function lastCompetition(err, players) {
      if(err != null) { callback(err); return; }
      team.players = players;
      competitions_with_rubbers.push(team);
      callback(err, competitions_with_rubbers);
    }
  }
}

function getCompetitionsByName(name, callback) {
  var db = openDatabase();
  db.all('SELECT * FROM competitions where name like \'%' + name + '%\'',
    function(err, rows) { db.close(); callback(err, rows); }
  );
}

function addCompetition(name, callback) {
  var db = openDatabase();
  db.run('insert into competitions (name) values ($name)', {$name: name}, function(err) {db.close(); callback(err, this.lastID);});
}

function deleteCompetition(ID, callback) {
  var db = openDatabase();
  db.run('delete from competitions where ID = $id', {$id: ID},
    function(err) {
      db.run('delete from rubbers where competitionID = $id', {$id: ID},
        function(err) {
          db.close();
          callback(err);
        }
      );
    }
  );
}

function deleteAllCompetitions(callback) {
  var db = openDatabase();
  db.run('delete from competitions',
    function(err) {
      db.run('delete from rubbers',
        function(err) {
          db.close();
          callback(err);
        }
      );
    }
  );
}

module.exports = {
  getAll : getAllCompetitions,
  getByID : getCompetitionByID,
  getByName : getCompetitionsByName,
  add : addCompetition,
  deleteByID : deleteCompetition,
  deleteAll : deleteAllCompetitions
}
