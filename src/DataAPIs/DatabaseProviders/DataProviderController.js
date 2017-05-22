"use strict";

var playerAPI = require("./PlayerDataProvider");
var matchAPI = require("./MatchDataProvider");
var competitionAPI = require("./CompetitionDataProvider");
var teamAPI = require("./TeamDataProvider");
var userAPI = require("./UserDataProvider");
var sessionAPI = require("./SessionDataProvider");


module.exports = {
  players : playerAPI,
  matches : matchAPI,
  competitions : competitionAPI,
  teams : teamAPI,
  users : userAPI,
  sessions : sessionAPI
}
