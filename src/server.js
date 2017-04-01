"use strict"
var fs = require("fs");
var APIs = require("./DataAPIs/APIController");
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(handleBodyParseError)


var options = { setHeaders: deliverXHTML };
app.use(express.static("public", options));
app.use('/players', APIs.players);
app.use('/matches', APIs.matches);
app.use('/competitions', APIs.competitions);
app.use('/teams', APIs.teams);

var port = 8080;
var address = "192.168.0.12"//"localhost"
app.listen(port, address);

console.log("visit...");
console.log(address+":"+port);


function deliverXHTML(res, path, stat) {
    if (path.endsWith(".html"))
        res.header("Content-Type", "application/xhtml+xml");
}

function handleBodyParseError(error, req, res, next){
    if (error.message != undefined && error.message.includes("Unexpected token"))
        res.send("Invalid json");
    else
        next ();
}