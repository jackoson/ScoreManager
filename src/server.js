"use strict"
var fs = require("fs");
var player_api = require("./playerAPI");
var match_api = require("./matchAPI");
var express = require('express');
var app = express();

app.use(express.static("public"));
app.use('/players', player_api);
app.use('/matches', match_api);

var port = 8080;
var address = "localhost"
app.listen(port, address);

console.log("visit...");
console.log(address+":"+port);
