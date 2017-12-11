'use strict';
const electron = require('electron');
// Module to control application life.
const { app } = electron;
// Module to create native browser window.
const { BrowserWindow } = electron;
var path = require('path')

let win;

function createWindow() {
    // Create a window that fills the whole screen.
    const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
    win = new BrowserWindow({
        width,
        height,
        icon: path.join(__dirname, '/../www/assets/icons/png/128x128.png')
    });

    var url = process.env.E_URL || url.format({
        pathname: path.join(__dirname, '/../www/index.html'),
        protocol: 'file:',
        slashes: true
    });

    // and load the index.html of the app.
    win.loadURL(url);

    // Open the DevTools.
    win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});