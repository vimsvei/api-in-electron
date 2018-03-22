'use strict';

const electron = require('electron');
const path = require('path');
const url = require('url');
const server = require('./server/server');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const nativeImage = electron.nativeImage;

const config = require(path.join(__dirname, 'package.json'));
const appUrl = 'localhost:3000';
// const publishName = 'Processes Of Typical Bank';

let mainWindow = null;

app.setName(config.publishName);
// app.setName(publishName);

function createWindow() {
    let size = electron.screen.getPrimaryDisplay().workAreaSize;
    let image = nativeImage.createFromPath(path.join(__dirname, '/assets/logo.png'));

    mainWindow = new BrowserWindow({
        x: 0,
        y: 0,
        // width: size.width,
        // height: size.height,
        width: 1200,
        height: 700,
        frame: true,
        resizable: true,
        title: config.publishName,
        icon: image,
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/public/index.html'),
        protocol: 'file',
        slashes: 'true'
    }));

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    const content = mainWindow.webContents;
    content.openDevTools();
    content.inspectServiceWorker();
}

try {
    app.on('ready', createWindow);

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit();
    });

    app.on('activate', function () {
        if (mainWindow == null) createWindow();
    });
} catch(e) {
    console.log(e);
}
