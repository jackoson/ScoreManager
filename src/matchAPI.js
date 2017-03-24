"use strict"
var express = require('express')
var router = express.Router()
var matchesController = require('./databaseController').matches

router.get('/', function (req, res) {
  matchesController.getAllMatches(function(err,data){ res.send(data); })
})

router.get('/id/:id', function (req, res) {
  matchesController.getMatchByID(req.params.id, function(err,data){ res.send(data); })
})

router.post('/add', function (req, res) {
  var details = JSON.parse(req.body.params);
  matchesController.addMatch(details.players, details.type, details.datetime, function(err){ if (err == null) {res.send("success");} else {res.send("fail");}; })
})

router.get('/delete', function (req, res) {
  matchesController.deleteMatch(req.query.id, function(err){ if (err == null) {res.send("success");} else {res.send("fail");}; })
})

module.exports = router
