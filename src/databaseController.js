"use strict";

var playerAPI = require("./playerDataProvider");
var matchAPI = require("./matchDataProvider");

module.exports = {
  players : playerAPI,
  matches : matchAPI
}
