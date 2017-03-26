"use strict";

var playerAPI = require("./playerAPI");
var matchAPI = require("./matchAPI");
var competitionAPI = require("./competitionAPI");

module.exports = {
  players : playerAPI,
  matches : matchAPI,
  competitions : competitionAPI
}
