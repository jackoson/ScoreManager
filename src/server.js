"use strict"
var fs = require("fs");
var path = require("path");
var APIs = require("./DataAPIs/APIController");
var templateManager = require('./TemplateManager');
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(handleBodyParseError)

app.use(recordInfo);

var options = { setHeaders: deliverXHTML_static };
app.use(express.static("public", options));

app.set('view engine', 'ejs')
app.set('views', './templates');
app.use('/templates', deliverXHTML_templates);
app.use('/templates', templateManager);

app.use('/players', APIs.players);
app.use('/matches', APIs.matches);
app.use('/competitions', APIs.competitions);
app.use('/teams', APIs.teams);

var port = 8080;

var address = fs.readFileSync(path.resolve(__dirname, 'ipaddress.txt'), {encoding: 'utf-8'})//"192.168.0.12"//"localhost"
app.listen(port, address);

console.log("visit...");
console.log(address+":"+port);

function deliverXHTML_static(res, path, stat) {
    if (path.endsWith(".html"))
        res.header("Content-Type", "application/xhtml+xml");
}

function deliverXHTML_templates(req, res, next) {
    res.header("Content-Type", "application/xhtml+xml");
    next();
}

function handleBodyParseError(error, req, res, next){
    if (error.message != undefined && error.message.includes("Unexpected token"))
        res.send("Invalid json");
    else
        next ();
}

function recordInfo(req, res, next) {
    fs.appendFileSync(path.resolve(__dirname, '../reqs.log'), "url: "+ req.url +", ip: " + req.ip + ", agent: "+req.headers['user-agent'] + "\n"); 
    next();
}