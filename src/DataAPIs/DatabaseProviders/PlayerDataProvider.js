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
  db.get('SELECT * FROM players where ID = $value', {$value: ID},
    function(err, row) { db.close(); callback(err, row); }
  );
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
