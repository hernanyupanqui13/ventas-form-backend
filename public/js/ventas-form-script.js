const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");
const prevBtn = document.getElementById("prev-btn");

const mainForm = document.querySelector(".main-form");

nextBtn.addEventListener( "click", event => {
  document.querySelector("#form-part-2-tab").click();
});

prevBtn.addEventListener("click", event => {
  document.querySelector("#form-part-1-tab").click();
});

mainForm.addEventListener("submit", async event => {
  event.preventDefault();
  console.log("form submitted");

  const formData = new FormData(mainForm);

  const promise = fetch('submit-data',  {
    method: "post",
    body: formData
  });

  const options = {
    messages: {
      "async-block": "Cargando",
      "success": "Se han registrado las respuestas"
    }, 
    labels: {
      "success": "Perfecto!"
    }
  };

  await new AWN(options).asyncBlock(promise)

  mainForm.reset();
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



