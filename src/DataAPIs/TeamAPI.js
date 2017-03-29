"use strict"
var express = require('express');
var router = express.Router();
var dbController = require('./DatabaseProviders/DataProviderController');
var teamProvider = dbController.teams;

router.get('/', function (req, res) {
  teamProvider.getAll(function(err,data){ res.send(data); })
})

router.get('/id/:id', function (req, res) {
  teamProvider.getByID(req.params.id, function(err,data){ res.send(data); })
})

router.get('/name/:name', function (req, res) {
  teamProvider.getByName(req.params.name, function(err,data){ res.send(data); })
})

router.get('/add', function (req, res) {
  teamProvider.add(req.query.name, function(err){ if (err == null) {res.send("success");} else {res.send("fail");}; })
})

router.get('/delete', function (req, res) {
  teamProvider.deleteByID(req.query.id, function(err){ if (err == null) {res.send("success");} else {res.send("fail");}; })
})

module.exports = router
