"use strict"

var APIs = require("./DataAPIs/DatabaseProviders/DataProviderController");
var unseeder = require("./DatabaseUnSeed");

seed();

function seed() {
    unseeder.unseed(addPlayers)
}

function addPlayers() {
    var api = APIs.players;
    a();
    function a() {api.add("sam", 'm', b);}
    function b() {api.add("georgina", 'f', c);}
    function c() {api.add("ian", 'm', d);}
    function d() {api.add("lesley", 'f', addTeams);}
}

function addTeams() {
    var api = APIs.teams;
    a();
    function a() {
        one();
        var player1ID, player2ID;
        var teamID;
        function one() { api.add("blue", (err, id)=>{teamID = id; two();}) }
        function two() {APIs.players.getByName("lesley", (err, players)=>{player1ID = players[0].ID; three()}) }
        function three() {api.addTeamPlayer(player1ID, teamID, four);}
        function four() {APIs.players.getByName("sam", (err, players)=>{player2ID = players[0].ID; five()}) }
        function five() {api.addTeamPlayer(player2ID, teamID, b);}
    }
    function b() {
        one();
        var player1ID, player2ID;
        var teamID;
        function one() { api.add("red", (err, id)=>{teamID = id; two();}) }
        function two() {APIs.players.getByName("ian", (err, players)=>{player1ID = players[0].ID; three()}) }
        function three() {api.addTeamPlayer(player1ID, teamID, four);}
        function four() {APIs.players.getByName("georgina", (err, players)=>{player2ID = players[0].ID; five()}) }
        function five() {api.addTeamPlayer(player2ID, teamID, c);}
    }
    function c() {
        one();
        var player1ID, player2ID;
        var teamID;
        function one() { api.add("pink", (err, id)=>{teamID = id; two();}) }
        function two() {APIs.players.getByName("sam", (err, players)=>{player1ID = players[0].ID; three()}) }
        function three() {api.addTeamPlayer(player1ID, teamID, four);}
        function four() {APIs.players.getByName("georgina", (err, players)=>{player2ID = players[0].ID; five()}) }
        function five() {api.addTeamPlayer(player2ID, teamID, addCompetitions);}
    }

}

function addCompetitions() {
    var api = APIs.competitions;
    one();
    function one() { api.add("welcome tournement", two) }
    function two() { api.add("davis cup", three) }
    function three() { api.add("winter doubles", four) }
    function four() { api.add("easter box tennis", five) }
    function five() { api.add("summer term singles", six) }
    function six() { api.add("end of year tournement", addRubbers) }
}

function addRubbers() {
    var api = APIs.competitions;
    rub("welcome tournement", 1, a);
    function a() { rub("davis cup", 6, b); }
    function b() { rub("winter doubles", 2, c); }
    function c() { rub("easter box tennis", 2, d); }
    function d() { rub("summer term singles", 1, e); }
    function e() { rub("end of year tournement", 1, addMatches); }

    function rub(compName, rubNum, next) {
      api.getByName(compName, function(err, comps) { two(comps[0].ID, rubNum); });
      function two(id, n) { if(n>0) {api.addRubber(id, () => { two(id, n-1); })} else {next();}}
    }
}

function addMatches() {
    var api = APIs.matches;
    match(1, 'mens singles', '1996-03-16', {setsWon: 3, teamID: 1, players: ["sam"]}, {setsWon: 2, teamID: 2, players: ["ian"]}, b);
    function b() { match(2, 'womens singles', '1998-06-18', {setsWon: 1, teamID: 1, players: ["lesley"]}, {setsWon: 2, teamID: 2, players: ["georgina"]}, c); }
    function c() { match(null, 'mixed doubles', '2017-03-30', {setsWon: 0, teamID: null, players: ["lesley", "georgina"]}, {setsWon: 1, teamID:  null, players: ["sam", "ian"]}, d); }
    function d() { match(null, 'mixed singles', '2017-04-16', {setsWon: 1, teamID: null, players: ["georgina"]}, {setsWon: 0, teamID:  null, players: ["sam"]}, e); }
    function e() { match(null, 'mixed doubles', '2017-05-01', {setsWon: 0, teamID: null, players: ["ian", "georgina"]}, {setsWon: 1, teamID:  null, players: ["sam", "lesley"]}, f); }
    function f() { match(5, 'other', '2017-04-12', {setsWon: 3, teamID: 2, players: ["georgina"]}, {setsWon: 0, teamID:  3, players: ["sam"]}, g); }
    function g() { match(7, 'mens singles', '2017-05-16', {setsWon: 0, teamID: null, players: ["ian"]}, {setsWon: 1, teamID:  null, players: ["sam"]}, addUsers); }
    function match(rubberID, type, date, op1, op2, next) {
        one([])
        function one(ids1) {
          var playerName = op1.players.pop();
          APIs.players.getByName(playerName, (err, players)=>{
            ids1.push({ID: players[0].ID});
            if(op1.players.length == 0) { two(ids1, []); } else { one(ids1); }
          });
        }
        function two(ids1, ids2) {
          var playerName = op2.players.pop();
          APIs.players.getByName(playerName, (err, players)=>{
            ids2.push({ID: players[0].ID});
            if(op2.players.length == 0) { three(ids1, ids2); } else { two(ids1, ids2); }
          });
        }
        function three(ids1, ids2) { api.add(rubberID, type, date,[{"setsWon":op1.setsWon, "teamID": op1.teamID, "players": ids1}, {"setsWon":op2.setsWon, "teamID": op2.teamID, "players": ids2}], next);}
    }

}

function addUsers() {
    var api = APIs.users;
    a();
    function a() {
        one();
        function one() { api.add({username: "admin", password: "bigblue"}, two) }
        function two() { api.add({username: "sam", password: "beautiful"}, addSessions) }
    }
}

function addSessions() {
    var api = APIs.sessions;
    a();
    function a() {
        one();
        var player1ID, player2ID;
        function one() {APIs.players.getByName("lesley", (err, players)=>{player1ID = players[0].ID; two()}) }
        function two() {APIs.players.getByName("georgina", (err, players)=>{player2ID = players[0].ID; three()}) }
        function three() { api.add(player1ID, four) }
        function four() { api.add(player2ID, ()=>{console.log("Seeded");}) }
    }
}
