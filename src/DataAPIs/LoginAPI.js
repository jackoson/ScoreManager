"use strict"
var express = require('express');
var router = express.Router();
var userAPI = require('./DatabaseProviders/DataProviderController').users;
var sessionsAPI = require('./DatabaseProviders/DataProviderController').sessions;
var crypto = require('crypto');

router.post('/', function (req, res) {
  if(req.body.username == null || req.body.password == null) {
    res.status(403).send("Need username and password.");
  } else {
    userAPI.Authenticate(req.body.username, req.body.password, callback);
    function callback(authenticated, userid) {
      if(authenticated) {
        sessionsAPI.addSessionUser(req.sessionid, userid, () => {res.send("Login Successful");});
      } else {
        res.status(403).send("Invalid Username/Password.");
      }
    }
  }
});

module.exports = router
