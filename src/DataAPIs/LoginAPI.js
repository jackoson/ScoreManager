"use strict"
var express = require('express');
var router = express.Router();

router.post('/', function (req, res) {
  if(req.body.username == null || req.body.password == null) {
    res.status(403).send("Need username and password.");
  } else {
    res.send("got user name and password");
  }
});

module.exports = router
