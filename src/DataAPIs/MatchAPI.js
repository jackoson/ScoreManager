"use strict"
var express = require('express');
var router = express.Router();
var dbController = require('./DatabaseProviders/DataProviderController');
var provider = dbController.matches;

router.get('/', function (req, res) {
  provider.getAll(function(err,data){ if (err == null) { res.send(data); } else { res.status(400).send(err); }; })
})

router.get('/id/:id', function (req, res) {
  provider.getByID(req.params.id, function(err,data){ if (err == null) { res.send(data); } else { res.status(400).send(err); };  })
})

router.use('/add', function(req, res, next) {
  
  if (req.body.opponents.length != 2) {
    res.status(400).send("Need two and only two oppenents for a match.");
    return;
  }
  else {
    next();
  }
})
router.post('/add', function (req, res) {
  provider.add(req.body.rubber, req.body.type, req.body.datetime, req.body.opponents, function(err, id){
    if (err == null) { res.send(id.toString()); } else { res.status(400).send(err); };
  });
})

router.delete('/id/:id', function (req, res) {
  provider.deleteByID(req.params.id, function(err){
    if (err == null) {res.send("success");} else {res.status(400).send(err);};
  });
})

module.exports = router
