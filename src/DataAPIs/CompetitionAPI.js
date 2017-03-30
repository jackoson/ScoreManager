"use strict"
var express = require('express');
var router = express.Router();
var dbController = require('./DatabaseProviders/DataProviderController');
var provider = dbController.competitions;

router.get('/', function (req, res) {
  provider.getAll(function(err,data){ res.send(data); })
})

router.get('/id/:id', function (req, res) {
  provider.getByID(req.params.id, function(err,data){ res.send(data); })
})

router.get('/name/:name', function (req, res) {
  provider.getByName(req.params.name, function(err,data){ res.send(data); })
})

router.use('/add', function(req, res, next) {
  if (req.body.name == null) {
    res.send("ERROR: Need name to add team.");
  }
  else {
    next();
  }
})
router.post('/add', function (req, res) { 
  provider.add(req.body.name, function(err, id){
    if (err == null) { res.send(id.toString()); } else { res.send(err); };
  });
})

router.delete('/id/:id', function (req, res) {
  provider.deleteByID(req.params.id, function(err){
    if (err == null) {res.send("success");} else {res.send(err);}; 
  });
})

module.exports = router
