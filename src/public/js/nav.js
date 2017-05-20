
window.addEventListener('load', function() {
  var modal_showing = false;
  document.addEventListener('click', handler);

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
      }

    }
  }
});
