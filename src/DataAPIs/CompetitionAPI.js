"use strict"
var express = require('express');
var router = express.Router();
var dbController = require('./DatabaseProviders/DataProviderController');
var competitionController = dbController.competitions;

router.get('/', function (req, res) {
  competitionController.getAll(function(err,data){ res.send(data); })
})

router.get('/id/:id', function (req, res) {
  competitionController.getByID(req.params.id, function(err,data){ res.send(data); })
})

router.get('/name/:name', function (req, res) {
  competitionController.getByName(req.params.name, function(err,data){ res.send(data); })
})

router.get('/add', function (req, res) {
  competitionController.add(req.query.name, req.query.type, function(err){ if (err == null) {res.send("success");} else {res.send("fail");}; })
})

router.get('/delete', function (req, res) {
  competitionController.deleteByID(req.query.id, function(err){ if (err == null) {res.send("success");} else {res.send("fail");}; })
})

module.exports = router
