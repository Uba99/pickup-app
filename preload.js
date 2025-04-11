const { contextBridge, ipcRenderer } = require('electron');

// Ini jembatan ke renderer
contextBridge.exposeInMainWorld('electronAPI', {
  simpanData : (data) => ipcRenderer.invoke("simpan-data", data),
  ambilData: () => ipcRenderer.invoke("ambil-data"),
  hapusData: (index) => ipcRenderer.invoke("hapus-data", index),
  editData: (index, dataBaru) => ipcRenderer.invoke("edit-data", index, dataBaru),
});