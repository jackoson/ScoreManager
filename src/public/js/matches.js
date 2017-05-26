"use strict"

window.addEventListener('load', initialise);

function initialise() {
  document.getElementById("date_input").valueAsDate = new Date();
  document.getElementById("plus_button").addEventListener('click', showAddScreen);
  document.getElementById("cross_button").addEventListener('click', hideAddScreen);
  document.getElementById("tick_button").addEventListener('click', addMatch);

  document.getElementById("competition_input").addEventListener('change', competitionChange);
  Array.from(document.getElementsByClassName("players-input")).forEach((e)=>{e.addEventListener('input', showSuggestions);});
  Array.from(document.getElementsByClassName("players-input")).forEach((e)=>{e.addEventListener('keydown', checkKey)});
  Array.from(document.getElementsByClassName("players-input")).forEach((e)=>{e.addEventListener('focusout', clearSuggestions)});
  Array.from(document.getElementsByClassName("players-input")).forEach((e)=>{e.addEventListener('focusin', showSuggestions)});

  Array.from(document.getElementsByClassName("suggestions")).forEach((e)=>{e.addEventListener('click', onClickSuggestion)});
  Array.from(document.getElementsByClassName("suggestions")).forEach((e)=>{e.addEventListener('keydown', onSuggestionEnter)});
}

function onClickSuggestion() {
  addPlayerToOpponent(event.target.parentNode, event.target.selectedIndex);
  var search = findChildById(event.target.parentNode,"search");
  search.value = "";
  search.focus();
  event.target.style.visibility = "hidden";
}

function onSuggestionEnter(event) {
  if(event.keyCode == 13) { //enter
    addPlayerToOpponent(event.target.parentNode, event.target.selectedIndex);
    var search = findChildById(event.target.parentNode,"search");
    search.value = "";
    search.focus();
    event.target.style.visibility = "hidden";
  }
}

function showAddScreen() {
  document.getElementById("plus_button").style.display = "none";
  document.getElementById("addmatch_container").style.display = "block";
}

function hideAddScreen() {
  clearInputs();
  document.getElementById("plus_button").style.display = "block";
  document.getElementById("addmatch_container").style.display = "none";
}

function addMatch() {
  if(!validateInputs())
    return;
  document.getElementById("tick_button").removeEventListener('click', addMatch);
  document.getElementById("loading_ball").style.visibility = "visible";
  var match = {};
  match.datetime = document.getElementById("date_input").value;
  match.type = document.getElementById("type_input").value;
  if(document.getElementById("matchRubber_input").value != "") {
    match.rubber = document.getElementById("matchRubber_input").value;
  }
  var opponents = [];
  opponents.push(populateOpponent(document.getElementById("opponent1")));
  opponents.push(populateOpponent(document.getElementById("opponent2")));
  match.opponents = opponents;

  post("/matches/add", JSON.stringify(match), post_response, error);

  function post_response() { get("/templates/match_partial.ejs", get_response); }
  function error(message) {
    document.getElementById("feedback").innerHTML = message;
    document.getElementById("feedback").style.visibility = "visible";
    document.getElementById("tick_button").addEventListener('click', addMatch);
   }

  function get_response(template) {
    var rubber = document.getElementById("matchRubber_input").value;
    if(rubber != "") {
      var select = document.getElementById("competition_input");
      match.competitionName = select.options[select.selectedIndex].text;
      match.rubberID = rubber;
    }
    var container = document.getElementById("matches");
    container.innerHTML = ejs.render(template,{match: match}) + container.innerHTML;
    hideAddScreen();
    document.getElementById("loading_ball").style.visibility = "hidden";
    document.getElementById("tick_button").addEventListener('click', addMatch);
  }
}

function populateOpponent(op) {
  var opponent = {};
  opponent.setsWon = findChildById(op,"setswon_input").value;
  var players_added = findChildById(op,"players_added").childNodes;
  var players = [];
  for(var i = 0; i<players_added.length; i++) {
    if(players_added[i].tagName == "a") {
      players.push({ID: players_added[i].rev, name: players_added[i].text});
    }
  }
  opponent.players = players;
  var team = findChildById(op,"team_input")
  if(team.value != "") {
    opponent.teamID = team.value;
    opponent.teamName = team.options[team.selectedIndex].text;
  }
  return opponent;
}

function validateInputs() {
  document.getElementById("feedback").style.visibility = "hidden";
  if(document.getElementById("date_input").value == null) {
    document.getElementById("feedback").innerHTML = ("Must select a date.");
  } else if(document.getElementById("type_input").value == "") {
    document.getElementById("feedback").innerHTML = ("Must select a match type.");
  } else if(document.getElementById("competition_input").value != "free play" && document.getElementById("matchRubber_input").value == "") {
    document.getElementById("feedback").innerHTML = ("Must select free-play or a competition and rubber.");
  } else {
    var op1 = document.getElementById("opponent1");
    var op2 = document.getElementById("opponent2");
    if(findChildById(op1,"setswon_input").value == "" || findChildById(op2,"setswon_input").value == "") {
      document.getElementById("feedback").innerHTML = ("Must fill in sets won for both sides.");
    } else if(findChildById(op1,"players_added").innerHTML == "" || findChildById(op2,"players_added").innerHTML == "") {
      document.getElementById("feedback").innerHTML = ("Need a player on each side.");
    } else if(findChildById(op1,"team_input").value != "" && findChildById(op2,"team_input").value == "") {
      document.getElementById("feedback").innerHTML = ("Either both have a team or neither.");
    } else if(findChildById(op1,"team_input").value == "" && findChildById(op2,"team_input").value != "") {
      document.getElementById("feedback").innerHTML = ("Either both sides have a team or neither.");
    } else {
      return true;
    }
  }
  document.getElementById("feedback").style.visibility = "visible";
  return false;
}

function clearInputs() {
  document.getElementById("date_input").valueAsDate = new Date();
  document.getElementById("type_input").value = "";
  document.getElementById("competition_input").value = "free play"
  document.getElementById("matchRubber_input_container").style.visibility = "hidden";
  var op1 = document.getElementById("opponent1")
  findChildById(op1,"setswon_input").value = "";
  findChildById(op1,"players_added").innerHTML = "";
  findChildById(op1,"team_input").value != "";
  var op2 = document.getElementById("opponent2")
  findChildById(op2,"setswon_input").value = "";
  findChildById(op2,"players_added").innerHTML = "";
  findChildById(op2,"team_input").value != "";
  document.getElementById("feedback").innerHTML = "";
  document.getElementById("feedback").style.visibility = "hidden";
}

function checkKey(event) {
  if(event.keyCode == 40) { //down arrow
    findChildById(event.target.parentNode,"suggestions").focus();
  } else if(event.keyCode == 13) { //enter
    addPlayerToOpponent(event.target.parentNode, 0);
    event.target.value = "";
    showSuggestions(event);
  }
}

function addPlayerToOpponent(opponent, id) {
  var selected_element = findChildById(opponent,"suggestions").childNodes[id];
  var new_player = document.createElement("a");
  new_player.href = "/templates/players/id/" + selected_element.value;
  new_player.rev = selected_element.value;
  new_player.text = selected_element.text;
  var added_space = findChildById(opponent,"players_added");
  if(added_space.innerHTML != "") {
    added_space.innerHTML += ", "
  }
  added_space.appendChild(new_player);
}

function clearSuggestions(event) {
  var suggestions = findChildById(event.target.parentNode,"suggestions");
  if(!suggestions.focus) {
    suggestions.style.visibility = "hidden";
  }
}

function showSuggestions(event) {
  var search = event.target.value;
  var suggestions = findChildById(event.target.parentNode,"suggestions");
  if(search == "") {
    suggestions.style.visibility = "hidden";
  } else {
    get("/players/name/" + event.target.value, receive);
    function receive(responseText) {
      var players = JSON.parse(responseText);
      suggestions.innerHTML = "";
      if(players.length == 0) {
        var li = document.createElement("li");
        li.text = "none exist";
        suggestions.appendChild(li);
      } else {
        for(var i = 0; i<players.length; i++) {
          var option = document.createElement("option");
          option.text = players[i].name;
          option.value = players[i].ID;
          suggestions.add(option);
        }
      }
      suggestions.size = suggestions.length;
      suggestions.style.visibility = "visible";
    }
  }
}

function competitionChange(event) {
  if(event.target.value == "free play") {
    document.getElementById("matchRubber_input_container").style.visibility = "hidden";
  } else {
    get("/competitions/id/"+event.target.value, receive);
    function receive(responseText) {
      var competition = JSON.parse(responseText);
      document.getElementById("matchRubber_input").innerHTML = "";
      if(competition.rubbers.length == 0) {
        var option = document.createElement("option");
        option.text = "none exist";
        option.value = "";
        document.getElementById("matchRubber_input").add(option);
      } else {
        for(var i = 0; i<competition.rubbers.length; i++) {
          var option = document.createElement("option");
          option.text = competition.rubbers[i].ID;
          option.value = competition.rubbers[i].ID;
          document.getElementById("matchRubber_input").add(option);
        }
      }
      document.getElementById("matchRubber_input_container").style.visibility = "visible";
    }
  }
}

function get(addr, receive) {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (this.readyState != XMLHttpRequest.DONE)
      return;
    if(this.status != 200) {
      console.log(this.responseText);
      return;
    }
    receive(this.responseText);
  };
  req.open("GET", addr, true);
  req.send();
}

function post(addr, data, receive, error) {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (this.readyState != XMLHttpRequest.DONE)
      return;
    if(this.status != 200) {
      error(this.responseText);
      return;
    }
    receive(this.responseText);
  };
  req.open("POST", addr, true);
  req.setRequestHeader("Content-Type", "application/json");
  req.send(data);
}


function findChildById(parentNode, id) {
  if(parentNode.id == id) return parentNode;
  for(var i = 0; i< parentNode.childNodes.length; i++) {
    var r = findChildById(parentNode.childNodes[i], id);
    if(r != false) return r;
  }
  return false;
}
