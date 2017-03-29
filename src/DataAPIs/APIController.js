"use strict";

var playerAPI = require("./PlayerAPI");
var matchAPI = require("./MatchAPI");
var competitionAPI = require("./CompetitionAPI");
var teamAPI = require("./TeamAPI");

module.exports = {
  players : playerAPI,
  matches : matchAPI,
  competitions : competitionAPI,
  teams : teamAPI
}
