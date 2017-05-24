"use strict"

window.addEventListener('load', initialise);

function initialise() {
  document.getElementById("plus_button").addEventListener('click', showAddScreen);
  document.getElementById("cross_button").addEventListener('click', hideAddScreen);
}

function showAddScreen() {
  document.getElementById("plus_button").style.display = "none";
  document.getElementById("addmatch_container").style.display = "block";
}

function hideAddScreen() {
  document.getElementById("plus_button").style.display = "block";
  document.getElementById("addmatch_container").style.display = "none";
}
