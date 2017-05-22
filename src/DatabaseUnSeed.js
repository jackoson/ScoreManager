"use strict"

var APIs = require("./DataAPIs/DatabaseProviders/DataProviderController");

function unseed(callback) {
    removePlayers();
    function removePlayers() {
        APIs.players.deleteAll(removeMatches);
    }

    function removeMatches() {
        APIs.matches.deleteAll(removeTeams);
    }

    function removeTeams() {
        APIs.teams.deleteAll(removeCompetitions);
    }

    function removeCompetitions() {
        APIs.competitions.deleteAll(removeUsers);
    }

    function removeUsers() {
        APIs.users.deleteAll(removeSessions);
    }

    function removeSessions() {
        APIs.sessions.deleteAll( () => { console.log("Unseeded"); callback(); });
    }

}


module.exports.unseed = unseed;
