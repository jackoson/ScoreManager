"use strict"
var express = require('express');
var router = express.Router();
var dbController = require('./DatabaseProviders/DataProviderController');
var matchesController = dbController.matches;

router.get('/', function (req, res) {
  matchesController.getAll(function(err,data){ res.send(data); })
})

router.get('/id/:id', function (req, res) {
  matchesController.getByID(req.params.id, function(err,data){ res.send(data); })
})

router.post('/add', function (req, res) {
  var details = JSON.parse(req.body.params);
  matchesController.add(details.players, details.type, details.datetime, function(err){ if (err == null) {res.send("success");} else {res.send("fail");}; })
})

router.get('/delete', function (req, res) {
  matchesController.deleteByID(req.query.id, function(err){ if (err == null) {res.send("success");} else {res.send("fail");}; })
})

module.exports = router
