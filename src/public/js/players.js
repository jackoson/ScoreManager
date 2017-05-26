"use strict"

window.addEventListener('load', initialise);

var cross_pos = "left";

function initialise() {
  document.getElementById("addplayer_button").addEventListener('click', click_cross);
  document.getElementById("confirm_button").addEventListener('click', add_player);
}

function add_player() {
  document.getElementById("error_message").innerHTML = "";
  var name = document.getElementById("name_input").value;
  var sex = document.getElementById("sex_select").value;
  var req = new XMLHttpRequest();
  req.onreadystatechange = receive;
  function receive() {
    if (this.readyState != XMLHttpRequest.DONE)
      return;
    if(this.status == 200) {
      var new_user_id = this.responseText;
      document.getElementById("player_table").innerHTML += '<tr><td><a href="/templates/players/id/' + new_user_id + '" >'+ name + '</a></td><td>' + sex + '</td></tr>';
      click_cross();
    } else {
      document.getElementById("error_message").innerHTML = this.responseText;
    }
  }
  req.open("POST", "/players/add", true);
  req.setRequestHeader("Content-Type", "application/json");
  req.send(JSON.stringify({name: name, sex: sex}));
  return false;
}

function click_cross() {
  if(cross_pos == "left") {
    document.getElementById("name_input").value = "";
    document.getElementById("sex_select").value = "f";
    document.getElementById("addplayer_button").className = 'cross-right-animation';
    document.getElementById("addplayer_button_image").className = 'cross-clockwise-animation';
    setTimeout(()=>{
      document.getElementById("confirm_button").className = 'show-elements';
      document.getElementById("confirm_button_image").className = 'fade-in-animation';
      document.getElementById("name_input").className = 'show-elements fade-in-animation';
      document.getElementById("sex_select").className = 'show-elements fade-in-animation';
      document.getElementById("name_input").focus();
    }, 1000);
    cross_pos = "right";
  } else if(cross_pos == "right") {
    document.getElementById("confirm_button_image").className = 'fade-out-animation';
    document.getElementById("name_input").className = 'show-elements fade-out-animation';
    document.getElementById("sex_select").className = 'show-elements fade-out-animation';
    setTimeout(()=>{
      document.getElementById("addplayer_button").className = 'cross-left-animation';
      document.getElementById("addplayer_button_image").className = 'cross-anti-clockwise-animation';

      document.getElementById("confirm_button").className = "hide-elements";
      document.getElementById("name_input").className = "hide-elements";
      document.getElementById("sex_select").className = "hide-elements";
    }, 500);
    cross_pos = "left";
  }
}
