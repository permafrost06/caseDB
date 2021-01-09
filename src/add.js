const ipc = require("electron").ipcRenderer;

const submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const template = document.getElementById("template").value;
  const patient = document.getElementById("name").value;
  const referer = document.getElementById("referer").value;
  const specimen = document.getElementById("specimen").value;
  const gross_exam = document.getElementById("gross_exam").value;
  const me = document.getElementById("me").value;

  ipc.send(
    "add-new-record",
    `${patient} ${referer} ${specimen} ${gross_exam} ${me}`
  );
});

function loadTemplate(templateID) {
  console.log(templateID.value);
}
