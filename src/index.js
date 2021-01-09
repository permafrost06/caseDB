const { remote } = require("electron");
const BrowserWindow = remote.BrowserWindow;
const ipc = require("electron").ipcRenderer;

const addButton = document.getElementById("addButton");

var currentWindow = remote.getCurrentWindow();

addButton.addEventListener("click", () => {
  const modalPath = "src/add.html";
  let win = new BrowserWindow({
    width: 600,
    height: 400,
    parent: currentWindow,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  win.on("close", () => {
    win = null;
  });
  win.loadFile(modalPath);
  // win.webContents.openDevTools();
});

ipc.on("new-record-added", (event, data) => {
  console.log(data);
});

function showReport(id) {
  ipc.send("report-requested", id);
}
