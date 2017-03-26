"use strict";

var playerAPI = require("./PlayerDataProvider");
var matchAPI = require("./MatchDataProvider");
var competitionAPI = require("./CompetitionDataProvider");

module.exports = {
  players : playerAPI,
  matches : matchAPI,
  competitions : competitionAPI
}
