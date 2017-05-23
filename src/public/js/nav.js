"use strict"

window.addEventListener('load', initialise);

function initialise() {
  var modal_showing = false;
  document.addEventListener('click', handler);

  document.getElementById("login-form").onsubmit = postForm;
  document.getElementById("logout_button").addEventListener('click', logout);

  function handler(event){
    if( modal_showing == true && !event.target.className.includes('model-item') ) {
      modal_showing = false;
      document.getElementById("login_modal").style['display'] = "none";
      document.getElementById("logout_modal").style['display'] = "none";
    } else if( modal_showing == false && event.target.id == 'signin' ){
      modal_showing = true;
      if(document.getElementById("logged_in").value == "true") {
        document.getElementById("logout_modal").style['display'] = "block";
      } else if(document.getElementById("logged_in").value == "false") {
        document.getElementById("login_modal").style['display'] = "block";
        document.getElementById("username-input").focus();
      }
    }
  }
}

function postForm() {
  document.getElementById("error-message").innerHTML = "";
  var req = new XMLHttpRequest();
  req.onreadystatechange = receive;
  function receive() {
    if (this.readyState != XMLHttpRequest.DONE)
      return;
    document.getElementById("error-message").innerHTML = this.responseText;
    if(this.status == 200) {
      location.reload();
    }
  }
  req.open("POST", "/login/login", true);
  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  var username = document.getElementById("username-input").value;
  var password = document.getElementById("password-input").value;
  req.send("username=" + username + "&password=" + password);
  return false;
}

function logout() {
  var req = new XMLHttpRequest();
  req.onreadystatechange = receive;
  function receive() {
    if (this.readyState != XMLHttpRequest.DONE)
      return;
    if(this.status == 200) {
      location.reload();
    }
  }
  req.open("POST", "/login/logout", true);
  req.send();
}
