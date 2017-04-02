"use strict"

var express = require('express');
var router = express.Router();

var api = require('./DataAPIs/DatabaseProviders/DataProviderController');

router.get('/players', function (req, res) {
  api.players.getAll((err, data) => {
    if( err != null ) {res.send(err);}
    res.render('players', {players: data});})
  
})

module.exports = router;