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

document.querySelector("#add-file-btn").addEventListener("click", event => {
  addFileInput();
});

function addFileInput() {
  const inputFileContainer = document.querySelector(".files-input-container");
  const htmlElement = document.createElement("div");
  htmlElement.classList.add("mb-2")
  
  htmlElement.innerHTML = `
    <label class="form-label" for="formFile">
      Adjunte el otro archivo
    </label>
    <div class="d-flex flex-row align-items-start">
      <input type="file" name="formFile[]" class="form-control file-input" />
      <button type="button" onclick="handleRemove(event)" class="btn btn-outline-danger ms-1">Quitar</button>
    </div>

  `;

  inputFileContainer.append(htmlElement);
  
}
function handleRemove(event) {
  removeFileInput(event.target);
}

function removeFileInput(target) {
  console.log(target.parentElement);
  target.parentElement.parentElement.remove();
}
