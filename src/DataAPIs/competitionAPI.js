"use strict"
var express = require('express');
var router = express.Router();
var dbController = require('./DatabaseProviders/DataProviderController');
var competitionController = dbController.competitions;

router.get('/', function (req, res) {
  competitionController.getAllCompetitions(function(err,data){ res.send(data); })
})

router.get('/id/:id', function (req, res) {
  competitionController.getCompetitionByID(req.params.id, function(err,data){ res.send(data); })
})

router.get('/name/:name', function (req, res) {
  competitionController.getCompetitionsByName(req.params.name, function(err,data){ res.send(data); })
})

router.get('/add', function (req, res) {
  competitionController.addCompetition(req.query.name, req.query.type, function(err){ if (err == null) {res.send("success");} else {res.send("fail");}; })
})

router.get('/delete', function (req, res) {
  competitionController.deleteCompetition(req.query.id, function(err){ if (err == null) {res.send("success");} else {res.send("fail");}; })
})

module.exports = router
