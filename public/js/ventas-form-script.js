const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");
const prevBtn = document.getElementById("prev-btn");

nextBtn.addEventListener( "click", event => {
  document.querySelector("#form-part-2-tab").click();
});

prevBtn.addEventListener("click", event => {
  document.querySelector("#form-part-1-tab").click();
});

submitBtn.addEventListener("click", event => {
  //event.preventDefault();
  console.log("form submitted");
  //document.forms[0].reset();
});

// Init Plugins
$(document).ready(() => {

  $("#cantidad-pacientes").TouchSpin({
    min: 0,
    max: 100,
    boostat: 5,
    maxboostedstep: 10,
  });

});

