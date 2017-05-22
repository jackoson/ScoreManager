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
        function five() {api.addTeamPlayer(player2ID, teamID, addMatches);}
    }

}

function addMatches() {
    var api = APIs.matches;
    a();
    function a() {
        one();
        var player1ID, player2ID;
        function one() {APIs.players.getByName("sam", (err, players)=>{player1ID = players[0].ID; two()}) }
        function two() {APIs.players.getByName("ian", (err, players)=>{player2ID = players[0].ID; three()}) }
        function three() {api.add(1, 'mens singles', '1996-03-16 09:00:00',[{"setsWon":3, "teamID": 1, "players": [player1ID]}, {"setsWon":2, "teamID": 2, "players": [player2ID]}], b);}
    }
    function b(err, matchID) {
        one();
        var player1ID, player2ID;
        function one() {APIs.players.getByName("lesley", (err, players)=>{player1ID = players[0].ID; two()}) }
        function two() {APIs.players.getByName("georgina", (err, players)=>{player2ID = players[0].ID; three()}) }
        function three() {api.add(1, 'womens singles', '1998-06-18 09:00:00',[{"setsWon":1, "teamID": 1, "players": [player1ID]}, {"setsWon":2, "teamID": 2, "players": [player2ID]}], c);}
    }
    function c() {
        one();
        var player1ID, player2ID, player3ID, player4ID;
        function one() {APIs.players.getByName("lesley", (err, players)=>{player1ID = players[0].ID; two()}) }
        function two() {APIs.players.getByName("georgina", (err, players)=>{player2ID = players[0].ID; three()}) }
        function three() {APIs.players.getByName("sam", (err, players)=>{player3ID = players[0].ID; four()}) }
        function four() {APIs.players.getByName("ian", (err, players)=>{player4ID = players[0].ID; five()}) }
        function five() {api.add(1, 'mixed doubles', '2017-03-30 12:00:00',[{"setsWon":0, "players": [player1ID, player2ID]}, {"setsWon":1, "players": [player3ID, player4ID]}], addCompetitions );}
    }
}

function addCompetitions() {
    var api = APIs.competitions;
    a();
    function a() {
        one();
        function one() { api.add("davis cup", two) }
        function two() { api.add("easter box tennis", addUsers) }
    }
}

function addUsers() {
    var api = APIs.users;
    a();
    function a() {
        one();
        function one() { api.add({name: "admin", password: "bigblue"}, two) }
        function two() { api.add({name: "sam", password: "beautiful"}, addSessions) }
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
