const { app, BrowserWindow, Menu } = require("electron");
const ipc = require("electron").ipcMain;

let mainWin = null;
var ret = {};
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
  createDatabase();
}

function createDatabase() {
  var sqlite3 = require("sqlite3").verbose();
  var db = new sqlite3.Database(app.getPath("userData") + "/caseDB.db");
  console.log(app.getPath("userData"));
  db.serialize(function () {
    db.run("CREATE TABLE if not exists lorem (info TEXT)");

    var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    for (var i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
    }
    stmt.finalize();

    db.each("SELECT rowid AS id, info FROM lorem", function (err, row) {
      ret[row.id] = row.info;
    });
    console.log(ret);
  });

  db.close();
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
  mainWin.webContents.send("new-record-added", ret);
});

ipc.on("report-requested", (event, id) => {
  mainWin.loadFile("src/report.html");
  mainWin.once("ready-to-show", () => {
    mainWin.send("report-data", id);
  });
});
