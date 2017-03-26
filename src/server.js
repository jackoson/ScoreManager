"use strict"
var fs = require("fs");
var APIs = require("./DataAPIs/APIController");
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use('/players', APIs.players);
app.use('/matches', APIs.matches);
app.use('/competitions', APIs.competitions);

var port = 8080;
var address = "localhost"
app.listen(port, address);

console.log("visit...");
console.log(address+":"+port);
