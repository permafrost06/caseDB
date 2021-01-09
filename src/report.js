const { remote } = require("electron");
const ipc = require("electron").ipcRenderer;

ipc.on("report-data", (event, id) => {
  console.log(id);
});

const indexPath = "src/index.html";
var currentWindow = remote.getCurrentWindow();

const backButton = document.getElementById("backButton");
const printButton = document.getElementById("printButton");

backButton.addEventListener("click", () => {
  currentWindow.loadFile(indexPath);
});

printButton.addEventListener("click", () => {
  window.print();
});
