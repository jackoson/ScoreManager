"use strict"
var express = require('express')
var router = express.Router()
var dbController = require('./databaseController')
var playerController = dbController.players

router.get('/', function (req, res) {
  playerController.getAllPlayers(function(err,data){ res.send(data); })
})

router.get('/id/:id', function (req, res) {
  playerController.getPlayerByID(req.params.id, function(err,data){ res.send(data); })
})

router.get('/name/:name', function (req, res) {
  playerController.getPlayerByName(req.params.name, function(err,data){ res.send(data); })
})

router.get('/sex/:sex', function (req, res) {
  playerController.getPlayerBySex(req.params.sex, function(err,data){ res.send(data); })
})

router.get('/add', function (req, res) {
  if (req.params.name.contains(":"))
    res.err("The symbol ':' is not allowed in names.");
  playerController.addPlayer(req.query.name, req.query.sex, function(err){ if (err == null) {res.send("success");} else {res.send("fail");}; })
})

router.get('/delete', function (req, res) {
  playerController.deletePlayer(req.query.id, function(err){ if (err == null) {res.send("success");} else {res.send("fail");}; })
})

module.exports = router
