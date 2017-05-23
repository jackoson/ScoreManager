"use strict"

window.addEventListener('load', initialise);

var cross_pos = "left";

function initialise() {
  document.getElementById("addplayer-button").addEventListener('click', spin);
}

function spin(event) {
  if(cross_pos == "left") {
    document.getElementById("addplayer-button").className = 'cross-right-animation';
    document.getElementById("addplayer-button-image").className = 'cross-clockwise-animation';
    setTimeout(()=>{
      document.getElementById("confirm_button").className = 'show-elements';
      document.getElementById("confirm_button_image").className = 'fade-in-animation';
      document.getElementById("name_input").className = 'show-elements fade-in-animation';
      document.getElementById("sex_select").className = 'show-elements fade-in-animation';
    }, 1000);
    cross_pos = "right";
  } else if(cross_pos == "right") {
    document.getElementById("confirm_button_image").className = 'fade-out-animation';
    document.getElementById("name_input").className = 'show-elements fade-out-animation';
    document.getElementById("sex_select").className = 'show-elements fade-out-animation';
    setTimeout(()=>{
      document.getElementById("addplayer-button").className = 'cross-left-animation';
      document.getElementById("addplayer-button-image").className = 'cross-anti-clockwise-animation';

      document.getElementById("confirm_button").className = "hide-elements";
      document.getElementById("name_input").className = "hide-elements";
      document.getElementById("sex_select").className = "hide-elements";
    }, 500);
    cross_pos = "left";
  }
}
