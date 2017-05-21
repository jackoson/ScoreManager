"use strict"

var express = require('express');
var router = express.Router();

var api = require('./DataAPIs/DatabaseProviders/DataProviderController');

router.get('/players/id/:id', function (req, res) {
  api.players.getByID(req.params.id, (err, data) => {
    if( err != null ) {res.send(err);}
    res.render('player', {player: data, logged_in: true});
  })
})

router.get('/players', function (req, res) {
  api.players.getAll((err, data) => {
    if( err != null ) {res.send(err);}
    res.render('players', {players: data, logged_in: true});
  })
})

router.get('/matches', function (req, res) {
  api.matches.getAll((err, data) => {
    if( err != null ) {res.send(err);}
    res.render('matches', {matches: data, logged_in: true});
  })
})

router.get('/teams', function (req, res) {
  api.teams.getAll((err, data) => {
    if( err != null ) {res.send(err);}
    res.render('teams', {teams: data, logged_in: true});
  })
})

router.get('/competitions', function (req, res) {
  api.competitions.getAll((err, data) => {
    if( err != null ) {res.send(err);}
    res.render('competitions', {competitions: data, logged_in: true});
  })
})

router.get('/home', function (req, res) {
  res.render('home', { logged_in: true });
})

module.exports = router;
