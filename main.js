const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  win.loadFile('index.html');
}

// Fungsi bantu buat ambil path file
const filePath = path.join(__dirname, "data", "pickup-data.json");

function bacaData() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function simpanData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Handler ambil data
ipcMain.handle("ambil-data", () => {
  return bacaData();
});

// Handler simpan data baru
ipcMain.handle("simpan-data", (event, dataBaru) => {
  const dataLama = bacaData();
  dataLama.push(dataBaru);
  simpanData(dataLama);
});

// Handler edit data
ipcMain.handle("edit-data", (event, index, dataBaru) => {
  const data = bacaData();
  data[index] = dataBaru;
  simpanData(data);
});

// Handler hapus data
ipcMain.handle("hapus-data", (event, index) => {
  const data = bacaData();
  data.splice(index, 1);
  simpanData(data);
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});