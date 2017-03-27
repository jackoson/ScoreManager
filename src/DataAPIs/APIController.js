"use strict";

var playerAPI = require("./PlayerAPI");
var matchAPI = require("./MatchAPI");
var competitionAPI = require("./CompetitionAPI");

module.exports = {
  players : playerAPI,
  matches : matchAPI,
  competitions : competitionAPI
}
