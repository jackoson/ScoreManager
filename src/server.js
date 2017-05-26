"use strict"
console.log(new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds());
var fs = require("fs");
var path = require("path");
var express = require('express');
var https = require('https');
var http = require('http');
var app = express();
var APIs = require("./DataAPIs/APIController");
var templateManager = require('./TemplateManager');
var sessions = require('./DataAPIs/DatabaseProviders/DataProviderController').sessions;
var users = require('./DataAPIs/DatabaseProviders/DataProviderController').users;

app.all('*', check_https);

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

app.use('/login', APIs.login);

app.use(page_not_found);

var options = {
    key  : fs.readFileSync(path.resolve(__dirname, 'ssl/key.pem')),
    ca   : fs.readFileSync(path.resolve(__dirname, 'ssl/csr.pem')),
    cert : fs.readFileSync(path.resolve(__dirname, 'ssl/cert.pem'))
}

https.createServer(options, app).listen(443, () => {console.log("https running")});
http.createServer(app).listen(80, () => {console.log("http running")});

function page_not_found(req, res) {
  deliverXHTML_templates(req, res, sendError);
  function sendError() {
    var login_info = {logged_in: req.logged_in != null, user: req.logged_in_user};
    res.header("Content-Type", "application/xhtml+xml");
    res.status(404).render('page_not_found',{login: login_info});
  }
}

function deliverXHTML_static(res, path, stat) {
    if (path.endsWith(".html"))
        res.header("Content-Type", "application/xhtml+xml");
}

function deliverXHTML_templates(req, res, next) {
    if(req.headers.accept.includes("application/xhtml+xml"))
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
    deliverXHTML_templates(req, res, () => {res.sendFile(path.resolve(__dirname, "public/landing.html"));})
  }
}

function check_https(req, res, next) {
  if(!req.secure) {
    res.clearCookie("session");
    res.redirect("https://" + req.hostname + req.url);
  } else {
    next();
  }
}

function handle_session(req, res, next) {
    if(req.cookies.session == null || req.cookies.session_timeout == null || req.session_reset == true) {
        sessions.add(null, setCookie);
    } else {
        sessions.getByID(req.cookies.session, addUser);
    }
    function addUser(err, data) {
        if( err != null || data == null) {
            sessions.add(null, setCookie);
        } else if(data.userID != null) {
            req.sessionid = req.cookies.session;
            req.logged_in = true;
            req.logged_in_user = {id: data.userID};
            users.getByID(data.userID, setUser);
            function setUser(err, data) {
              if(err != null || data == null) throw Exception("User does not exist");
                req.logged_in_user.username = data.username;
                sessions.updateSessionExpiration(req.sessionid, next);
            }
        } else {
            req.sessionid = req.cookies.session;
            next();
        }
    }
    function setCookie(err, id) {
        req.sessionid = req.cookies.session;
        res.cookie("session",id);
        res.cookie("session_timeout","true", {expires: new Date(Date.now() + 86400000 /*One day*/ )});
        next();
    }
}

setInterval(clearOldSessions, 600000 /*Every ten minutes*/ );
function clearOldSessions() {
    sessions.deleteOldSessions(new Date(Date.now() - 86400000 /*Day old*/));
}
