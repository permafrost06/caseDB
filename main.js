const { app, BrowserWindow, Menu } = require("electron");
const ipc = require("electron").ipcMain;

let mainWin = null;

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWin) {
      if (mainWin.isMinimized()) mainWin.restore();
      mainWin.focus();
    }
  });

  function createWindow() {
    mainWin = new BrowserWindow({
      width: 1000,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
      },
    });

    var menu = Menu.buildFromTemplate([
      {
        label: "File",
        submenu: [
          {
            label: "Exit",
            click() {
              app.quit();
            },
          },
        ],
      },
      {
        label: "Help",
        submenu: [
          {
            label: "About",
          },
        ],
      },
    ]);

    Menu.setApplicationMenu(menu);

    mainWin.loadFile("src/index.html");

    mainWin.maximize();

    mainWin.webContents.openDevTools();
  }

  app.whenReady().then(createWindow);
  console.log(app.getPath("userData"));
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipc.on("add-new-record", (event, data) => {
  mainWin.webContents.send("new-record-added", data);
});

ipc.on("report-requested", (event, id) => {
  mainWin.loadFile("src/report.html");
  mainWin.once("ready-to-show", () => {
    mainWin.send("report-data", id);
  });
});
