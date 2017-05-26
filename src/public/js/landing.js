"use strict"

window.addEventListener('load', init);

function init() {
  var svg_object = document.getElementById("logo");
  var svg_document = svg_object.contentDocument;
  var ball = svg_document.getElementById("ball");
  var state = {pos: 50, vel:0}
  var int = setInterval(() => {if(animate(state, ball)) {clearInterval(int)};}, 40);
}

function animate(state, obj) {
  state.vel -= 1;
  state.pos += state.vel;
  if(state.pos < 0) {
    state.pos = 0-state.pos;
    if(state.vel > -3 ) {return true;}
    state.vel = -1-state.vel;
  }
  setY(obj, state.pos);
}

function setY(obj, y) {
  obj.setAttribute("transform", "translate(0,"+(10-y)+")");
}
