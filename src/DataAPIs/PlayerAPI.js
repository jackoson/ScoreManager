"use strict"
var express = require('express');
var router = express.Router();
var dbController = require('./DatabaseProviders/DataProviderController');
var provider = dbController.players;

router.get('/', function (req, res) {
  provider.getAll(function(err,data){ res.send(data); })
})

router.get('/id/:id', function (req, res) {
  provider.getByID(req.params.id, function(err,data){ res.send(data); })
})

router.get('/name/:name', function (req, res) {
  provider.getByName(req.params.name, function(err,data){ res.send(data); })
})

router.get('/sex/:sex', function (req, res) {
  provider.getBySex(req.params.sex, function(err,data){ res.send(data); })
})

router.use('/add', function(req, res, next) {
  if(req.body.name == undefined) {
    res.status(400).send("Name not specified.");
  }
  else if (req.body.name.includes(":")) {
    res.status(400).send("The symbol ':' is not allowed in names.");
  }
  else if (req.body.name == null || req.body.sex == null) {
    res.status(400).send("Need both name and sex to add player.");
  }
  else if (!(req.body.sex == provider.male || req.body.sex == provider.female || req.body.sex == provider.other)) {
    res.status(400).send("Not valid sex.");
  }
  else if (req.body.name == "") {
    res.status(400).send("Cannot have empty name.");
  }
  else {
    next();
  }
})
router.post('/add', function (req, res) {
  provider.add(req.body.name, req.body.sex, function(err, id){
    if (err == null) { res.send(id.toString()); } else { res.status(400).send(err); };
  });
})

router.delete('/id/:id', function (req, res) {
  provider.deleteByID(req.params.id, function(err){
    if (err == null) {res.send("success");} else {res.status(400).send(err);};
  });
})

module.exports = router
