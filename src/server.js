"use strict"
var fs = require("fs");
var path = require("path");
var express = require('express');
var https = require('https');
var http = require('http');
var app = express();
var APIs = require("./DataAPIs/APIController");
var templateManager = require('./TemplateManager');
var sessions = require('./DataAPIs/DatabaseProviders/SessionDataProvider')

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(handleBodyParseError)

var cookieParser = require('cookie-parser')
app.use(cookieParser())

app.use(log_request);

app.use(handle_session);

app.get('/', landing_page_redirect);

var options = { setHeaders: deliverXHTML_static, index: "landing.html" };
app.use(express.static(path.resolve(__dirname, 'public'), options));

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, './templates'));
app.use('/templates', deliverXHTML_templates);
app.use('/templates', templateManager);

app.use('/players', APIs.players);
app.use('/matches', APIs.matches);
app.use('/competitions', APIs.competitions);
app.use('/teams', APIs.teams);

var address = fs.readFileSync(path.resolve(__dirname, 'ipaddress.txt'), {encoding: 'utf-8'})

var options = {
    key  : fs.readFileSync(path.resolve(__dirname, 'ssl/key.pem')),
    ca   : fs.readFileSync(path.resolve(__dirname, 'ssl/csr.pem')),
    cert : fs.readFileSync(path.resolve(__dirname, 'ssl/cert.pem'))
}

http.createServer(app).listen(80, () => {console.log("http running")});
https.createServer(options, app).listen(443, () => {console.log("https running")});

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

function log_request(req, res, next) {
    fs.appendFileSync(path.resolve(__dirname, '../reqs.log'), "time: " + Date() + ", url: "+ req.url +", ip: " + req.ip + ", agent: "+req.headers['user-agent'] + "\n");
    next();
}

function landing_page_redirect(req, res) {
  if(req.cookies.visited != null && req.cookies.visited == "true") {
    res.cookie("visited", "true", {expires: new Date(new Date().setFullYear(new Date().getFullYear() + 10))});
    res.redirect("/templates/home/");
  } else {
    res.cookie("visited", "true", {expires: new Date(new Date().setFullYear(new Date().getFullYear() + 10))});
    res.sendFile(path.resolve(__dirname, "public/landing.html"));
  }
}

function handle_session(req, res, next) {
    if(req.cookies.session == null || req.cookies.session_timeout == null) {
        sessions.add(null, setCookie);
    } else {
        sessions.getByID(req.cookies.session, addUser);
    }
    function addUser(err, data) {
        if( err != null) {
            sessions.add(null, setCookie);
        } else if(data.userID != null) {
            req.logged_in = true;
            req.logged_in_user = data.userID;
            next();
        } else {
            next();
        }
    }
    function setCookie(err, id) {
        res.cookie("session",id);
        res.cookie("session_timeout","true", {expires: new Date(Date.now() + 86400000 /*One day*/ )});
        next();
    }
}

setInterval(clearOldSessions, 600000 /*Every ten minutes*/ );
function clearOldSessions() {
    sessions.deleteOldSessions(new Date().now() - 86400000);
}
