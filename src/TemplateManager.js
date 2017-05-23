"use strict"

var express = require('express');
var router = express.Router();

var api = require('./DataAPIs/DatabaseProviders/DataProviderController');

router.get('/players/id/:id', function (req, res) {
  api.players.getByID(req.params.id, (err, data) => {
    var login_info = {logged_in: req.logged_in != null, user: req.logged_in_user};
    if( err != null ) {res.render('error',{error: err, login: login_info}); return;}
    res.render('player', {player: data, login: login_info});
  })
})

router.get('/players', function (req, res) {
  api.players.getAll((err, data) => {
    var login_info = {logged_in: req.logged_in != null, user: req.logged_in_user};
    if( err != null ) {res.render('error',{error: err, login: login_info}); return;}
    res.render('players', {players: data, login: login_info});
  })
})

router.get('/matches', function (req, res) {
  api.matches.getAll((err, data) => {
    var login_info = {logged_in: req.logged_in != null, user: req.logged_in_user};
    if( err != null ) {res.render('error',{error: err, login: login_info}); return;}
    res.render('matches', {matches: data, login: login_info});
  })
})

router.get('/teams', function (req, res) {
  api.teams.getAll((err, data) => {
    var login_info = {logged_in: req.logged_in != null, user: req.logged_in_user};
    if( err != null ) {res.render('error',{error: err, login: login_info}); return;}
    res.render('teams', {teams: data, login: login_info});
  })
})

router.get('/competitions', function (req, res) {
  api.competitions.getAll((err, data) => {
    var login_info = {logged_in: req.logged_in != null, user: req.logged_in_user};
    if( err != null ) {res.render('error',{error: err, login: login_info}); return;}
    res.render('competitions', {competitions: data, login: login_info});
  })
})

router.get('/home', function (req, res) {
  var login_info = {logged_in: req.logged_in != null, user: req.logged_in_user};
  res.render('home', { login: login_info });
})

module.exports = router;
