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
  if (name == null || sex == null) { callback("ERROR: Need both name and gender to add player."); }
  if (!(sex == male || sex == female || sex == other)) {callback("ERROR: Not valid sex."); }
  var db = openDatabase();
  db.run('insert into players (name, sex) values ($name, $sex)', {$name: name, $sex: sex}, callback );
}

function deletePlayer(ID, callback) {
  var db = openDatabase();
  db.run('delete from players where ID = $id', {$id: ID}, callback );
}

module.exports = {
  getAllPlayers : getAllPlayers,
  getPlayerByID : getPlayerByID,
  getPlayersByName : getPlayersByName,
  getPlayersBySex : getPlayersBySex,
  female : female,
  male : male,
  other : other,
  addPlayer : addPlayer,
  deletePlayer : deletePlayer
}
