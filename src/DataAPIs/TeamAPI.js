"use strict"
var express = require('express');
var router = express.Router();
var dbController = require('./DatabaseProviders/DataProviderController');
var provider = dbController.teams;

router.get('/', function (req, res) {
  provider.getAll(function(err,data){ res.send(data); })
})

router.get('/id/:id', function (req, res) {
  provider.getByID(req.params.id, function(err,data){ res.send(data); })
})

router.get('/name/:name', function (req, res) {
  provider.getByName(req.params.name, function(err,data){ res.send(data); })
})

router.use('/add', function(req, res, next) {
  if (req.body.name == null) { res.send("ERROR: Need name to add team."); }
  else { next(); }
})
router.post('/add', function (req, res) {
  provider.add(req.body.name, function(err, id){
    if (err == null) { res.send(id.toString()); } else { res.send(err); };
  });
})

router.use('/teamplayer/add', function(req, res, next) {
  if(req.method != "POST") { res.send("Cannot " + req.method + " " + req.originalUrl); }
  else if (req.body.playerID == null || req.body.teamID == null) { res.send("ERROR: Need both team id and player id."); }
  else { next(); }
})
router.post('/teamplayer/add', function (req, res) {
  provider.addTeamPlayer(req.body.playerID, req.body.teamID, function(err, id){
    if (err == null) { res.send(id.toString()); } else { res.send(err); };
  });
})

router.get('/teamplayer/id/:id', function (req, res) {
  provider.getTeamPlayerByID(req.params.id, function(err,data){ if (err == null) { res.send(data); } else { res.send(err); }; })
})

router.delete('/teamplayer/id/:id', function (req, res) {
  provider.deleteTeamPlayerByID(req.params.id, function(err){
    if (err == null) {res.send("success");} else {res.send(err);}; 
  });
})

router.delete('/id/:id', function (req, res) {
  provider.deleteByID(req.params.id, function(err){
    if (err == null) {res.send("success");} else {res.send(err);}; 
  });
})

module.exports = router
