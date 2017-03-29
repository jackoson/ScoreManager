"use strict"

var APIs = require("./DataAPIs/DatabaseProviders/DataProviderController");

unseed();

function unseed() {
    removePlayers();
}

function removePlayers() {
    APIs.players.deleteAll(removeMatches);
}

function removeMatches() {
    APIs.matches.deleteAll(removeTeams);
}

function removeTeams() {
    APIs.players.deleteAll(removeCompetitions);
}

function removeCompetitions() {
    APIs.players.deleteAll(()=>{console.log("Done")});
}
