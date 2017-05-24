"use strict"

window.addEventListener('load', initialise);

function initialise() {
  document.getElementById("plus_button").addEventListener('click', showAddScreen);
  document.getElementById("cross_button").addEventListener('click', hideAddScreen);
  document.getElementById("competition_change").addEventListener('change', competitionChange);
  Array.from(document.getElementsByClassName("players-input")).forEach((e)=>{e.addEventListener('input', textChange);});
  Array.from(document.getElementsByClassName("players-input")).forEach((e)=>{e.addEventListener('keydown', checkKey)});
}

function showAddScreen() {
  document.getElementById("plus_button").style.display = "none";
  document.getElementById("addmatch_container").style.display = "block";
}

function hideAddScreen() {
  document.getElementById("plus_button").style.display = "block";
  document.getElementById("addmatch_container").style.display = "none";
}

function checkKey(event) {
  if(event.keyCode == 40) { //down arrow
    findChildById(event.target.parentNode,"suggestions").focus();
  } else if(event.keyCode == 13) { //enter
    var selected_element = findChildById(event.target.parentNode,"suggestions").childNodes[0];
    var new_player = document.createElement("a");
    new_player.href = "/templates/players/id/" + selected_element.value;
    new_player.text = selected_element.text;
    var added_space = findChildById(event.target.parentNode,"players-added");
    if(added_space.innerHTML != "") {
      added_space.innerHTML += ", "
    }
    added_space.appendChild(new_player);
    event.target.value = "";
    textChange(event);
  }
}

function textChange(event) {
  var search = event.target.value;
  if(search == "") {
    findChildById(event.target.parentNode,"suggestions").style.visibility = "hidden";
  } else {
    get("/players/name/" + event.target.value, receive);
    function receive(responseText) {
      var players = JSON.parse(responseText);
      var suggestions = findChildById(event.target.parentNode,"suggestions");
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
    document.getElementById("matchRubber_input").style.visibility = "hidden";
  } else {
    get("/competitions/id/"+event.target.value, receive);
    function receive(responseText) {
      var competition = JSON.parse(responseText);
      document.getElementById("matchRubber_input_select").innerHTML = "";
      if(competition.rubbers.length == 0) {
        var option = document.createElement("option");
        option.text = "none exist";
        option.value = "none";
        document.getElementById("matchRubber_input_select").add(option);
      } else {
        for(var i = 0; i<competition.rubbers.length; i++) {
          var option = document.createElement("option");
          option.text = competition.rubbers[i].ID;
          option.value = competition.rubbers[i].ID;
          document.getElementById("matchRubber_input_select").add(option);
        }
      }
      document.getElementById("matchRubber_input").style.visibility = "visible";
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


function findChildById(parentNode, id) {
  if(parentNode.id == id) return parentNode;
  for(var i = 0; i< parentNode.childNodes.length; i++) {
    var r = findChildById(parentNode.childNodes[i], id);
    if(r != false) return r;
  }
  return false;
}
