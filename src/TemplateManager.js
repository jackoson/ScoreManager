"use strict"

var express = require('express');
var router = express.Router();

var api = require('./DataAPIs/DatabaseProviders/DataProviderController');

router.get('/players', function (req, res) {
  api.players.getAll((err, data) => {
    if( err != null ) {res.send(err);}
    res.render('players', {players: data});
  })
})

router.get('/matches', function (req, res) {
  api.matches.getAll((err, data) => {
    if( err != null ) {res.send(err);}
    res.render('matches', {matches: data});
  })
})

router.get('/teams', function (req, res) {
  api.teams.getAll((err, data) => {
    if( err != null ) {res.send(err);}
    res.render('teams', {teams: data});
  })
})

router.get('/competitions', function (req, res) {
  api.competitions.getAll((err, data) => {
    if( err != null ) {res.send(err);}
    res.render('competitions', {competitions: data});
  })
})

module.exports = router;