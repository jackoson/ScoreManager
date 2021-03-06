"use strict"

var openDatabase = require("./DatabaseConnector").openDatabase;
var db = openDatabase();

function getAllCompetitions(callback) {
  db.all('select competitions.ID, competitions.name from competitions', getCompetitions);
  function getCompetitions(err, competitions_basic) {
    if(err != null) { callback(err); return; }
    if(competitions_basic.length == 0) { callback(err, []); return; }
    var competitions_with_rubbers = [];
    var next_competition = competitions_basic.pop();
    if(competitions_basic.length > 0)
      db.all('select rubbers.ID from rubbers where rubbers.competitionID = $ID', {$ID: next_competition.ID},
        function(err, rubbers) { getCompetition(err, rubbers, next_competition, false); });
    else
      db.all('select rubbers.ID from rubbers where rubbers.competitionID = $ID', {$ID: next_competition.ID},
        function(err, rubbers) { getCompetition(err, rubbers, next_competition, true); });

    function getCompetition(err, rubbers, competition, lastCompetition) {
      if(err != null) { console.log("errored"); callback(err); return; }
      competition.rubbers = rubbers;
      competitions_with_rubbers.push(competition);
      if(lastCompetition)
      {
        callback(err, competitions_with_rubbers);
        return;
      }
      var next_competition = competitions_basic.pop();
      if(competitions_basic.length > 0)
        db.all('select rubbers.ID from rubbers where rubbers.competitionID = $ID', {$ID: next_competition.ID},
          function(err, rubbers) { getCompetition(err, rubbers, next_competition, false); });
      else
        db.all('select rubbers.ID from rubbers where rubbers.competitionID = $ID', {$ID: next_competition.ID},
          function(err, rubbers) { getCompetition(err, rubbers, next_competition, true); });
    }
  }
}

function getCompetitionByID(ID, callback){
  db.get('select ID, name from competitions where ID = $ID', {$ID: ID}, getCompetition);
  function getCompetition(err, competition_basic) {
    if(err != null) { callback(err); return; }
    if(competition_basic == null) { callback(err, {}); return; }
    var competition = competition_basic;
    db.all('select ID from rubbers where competitionID = $ID', {$ID: competition.ID},getRubbers);
    function getRubbers(err, rubbers) {
      if(err != null) { callback(err); return; }
      competition.rubbers = rubbers;
      callback(err, competition);
    }
  }
}

function getCompetitionsByName(name, callback) {
  db.all('SELECT * FROM competitions where name like \'%' + name + '%\'', callback);
}

function addCompetition(name, callback) {
  db.run('insert into competitions (name) values ($name)', {$name: name}, function(err) { callback(err, this.lastID);});
}

function addRubber(compId, callback) {
  db.run('insert into rubbers (competitionID) values ($compId)', {$compId: compId}, function(err) {callback(err, this.lastID);});
}

function deleteCompetition(ID, callback) {
  db.run('delete from competitions where ID = $id', {$id: ID},
    function(err) {
      db.run('delete from rubbers where competitionID = $id', {$id: ID}, callback);
    }
  );
}

function deleteAllCompetitions(callback) {
  db.run('delete from competitions',
    function(err) {
      db.run('delete from rubbers',callback);
    }
  );
}

module.exports = {
  getAll : getAllCompetitions,
  getByID : getCompetitionByID,
  getByName : getCompetitionsByName,
  add : addCompetition,
  addRubber : addRubber,
  deleteByID : deleteCompetition,
  deleteAll : deleteAllCompetitions
}
