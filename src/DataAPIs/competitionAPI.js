"use strict"
var express = require('express');
var router = express.Router();
var dbController = require('./DatabaseProviders/DataProviderController');
var competitionController = dbController.competitions;

router.get('/', function (req, res) {
  competitionController.getAllCompetitions(function(err,data){ res.send(data); })
})

router.get('/id/:id', function (req, res) {
  competitionController.getPlayerByID(req.params.id, function(err,data){ res.send(data); })
})

router.get('/name/:name', function (req, res) {
  competitionController.getPlayerByName(req.params.name, function(err,data){ res.send(data); })
})

router.get('/add', function (req, res) {
  if (req.params.name.contains(":"))
    res.err("The symbol ':' is not allowed in names.");
  competitionController.addPlayer(req.query.name, req.query.sex, function(err){ if (err == null) {res.send("success");} else {res.send("fail");}; })
})

router.get('/delete', function (req, res) {
  competitionController.deletePlayer(req.query.id, function(err){ if (err == null) {res.send("success");} else {res.send("fail");}; })
})

module.exports = router
