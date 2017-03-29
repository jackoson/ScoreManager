"use strict"

var APIs = require("./DataAPIs/DatabaseProviders/DataProviderController");

seed();

function seed() {
    addPlayers();
}

function addPlayers() {
    var api = APIs.players;
    a();
    function a() {api.addPlayer("sam", 'm', b);}
    function b() {api.addPlayer("georgina", 'f', c);}
    function c() {api.addPlayer("ian", 'm', d);}
    function d() {api.addPlayer("lesley", 'f', addMatches);}
}

function addMatches() {
    var api = APIs.matches;
    a();
    function a() {
        one();
        var player1ID, player2ID;
        function one() {APIs.players.getPlayersByName("sam", (err, players)=>{player1ID = players[0].ID; console.log(player1ID); two()}) }
        function two() {APIs.players.getPlayersByName("ian", (err, players)=>{player2ID = players[0].ID; three()}) }
        function three() {api.addMatch([{"id":player1ID, "setsWon":3}, {"id":player2ID, "setsWon":2}], 'mens singles', '1996-03-16 09:00:00', b);} 
    }
    function b() {
        one();
        var player1ID, player2ID;
        function one() {APIs.players.getPlayersByName("lesley", (err, players)=>{player1ID = players[0].ID; two()}) }
        function two() {APIs.players.getPlayersByName("georgina", (err, players)=>{player2ID = players[0].ID; three()}) }
        function three() {api.addMatch([{"id":player1ID, "setsWon":1}, {"id":player2ID, "setsWon":2}], 'womens singles', '1998-06-16 09:00:00', c);} 
    }
    function c() {
        one();
        var player1ID, player2ID, player3ID, player4ID;
        function one() {APIs.players.getPlayersByName("lesley", (err, players)=>{player1ID = players[0].ID; two()}) }
        function two() {APIs.players.getPlayersByName("georgina", (err, players)=>{player2ID = players[0].ID; three()}) }
        function three() {APIs.players.getPlayersByName("sam", (err, players)=>{player3ID = players[0].ID; four()}) }
        function four() {APIs.players.getPlayersByName("ian", (err, players)=>{player4ID = players[0].ID; five()}) }
        function five() {api.addMatch(
            [
                {"id":player1ID, "setsWon":2}, {"id":player2ID, "setsWon":1},
                {"id":player3ID, "setsWon":2}, {"id":player4ID, "setsWon":1}
            ]
            , 'mixed doubles', '2017-03-29 22:05:00', ()=>{console.log("Done");});} 
    }
}

function addTeams() {
    
}