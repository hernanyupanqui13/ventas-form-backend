const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");

nextBtn.addEventListener( "click", event => {
  document.querySelector("#form-part-2-tab").click();
});

submitBtn.addEventListener("click", event => {
  //event.preventDefault();
  console.log("form submitted");
  //document.forms[0].reset();
});