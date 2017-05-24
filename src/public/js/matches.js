"use strict"

window.addEventListener('load', initialise);

function initialise() {
  document.getElementById("plus_button").addEventListener('click', showAddScreen);
  document.getElementById("cross_button").addEventListener('click', hideAddScreen);
  document.getElementById("competition_change").addEventListener('change', competitionChange);
}

function showAddScreen() {
  document.getElementById("plus_button").style.display = "none";
  document.getElementById("addmatch_container").style.display = "block";
}

function hideAddScreen() {
  document.getElementById("plus_button").style.display = "block";
  document.getElementById("addmatch_container").style.display = "none";
}

function competitionChange(event) {
  if(event.target.value == "free play") {
    document.getElementById("matchRubber_input").style.visibility = "hidden";
  } else {
    var req = new XMLHttpRequest();
    req.onreadystatechange = receive;
    function receive() {
      if (this.readyState != XMLHttpRequest.DONE)
        return;
      if(this.status != 200) {
        console.log(this.responseText);
        return;
      }
      var competition = JSON.parse(this.responseText);
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

    req.open("GET", "/competitions/id/"+event.target.value, true);
    req.send();
  }

}
