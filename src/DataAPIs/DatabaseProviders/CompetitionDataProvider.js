"use strict"

var openDatabase = require("./DatabaseConnector").openDatabase;

function getAllCompetitions(callback) {
  var db = openDatabase();
  db.all('SELECT * FROM competitions',
    function(err, rows) { db.close(); callback(err, rows); }
  );
}

function getCompetitionByID(ID, callback){
  var db = openDatabase();
  db.get('SELECT * FROM competitions where ID = $value', {$value: ID},
    function(err, row) { db.close(); callback(err, row); }
  );
}

function getCompetitionsByName(name, callback) {
  var db = openDatabase();
  db.all('SELECT * FROM competitions where name like \'%' + name + '%\'',
    function(err, rows) { db.close(); callback(err, rows); }
  );
}

function addCompetition(name, type, callback) {
  var db = openDatabase();
  db.run('insert into competitions (name, type) values ($name, $type)', {$name: name, $type: type},
    function(err) { db.close(); callback(err); }
  );
}

function deleteCompetition(ID, callback) {
  var db = openDatabase();
  db.run('delete from players where ID = $id', {$id: ID}, 
    function(err) { db.close(); callback(err); }
  );
}

module.exports = {
  getAllCompetitions : getAllCompetitions,
  getCompetitionByID : getCompetitionByID,
  getCompetitionsByName : getCompetitionsByName,
  addCompetition : addCompetition,
  deleteCompetition : deleteCompetition
}
