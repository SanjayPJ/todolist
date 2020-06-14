// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')

let mainWindow, addWindow;

const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          accelerator: 'CmdOrCtrl+N',
          click: async () => {
            createAddWindow();
          } 
        },        
        {
          label: 'Clear todos',
          accelerator: 'CmdOrCtrl+K',
          click: async () => {
            mainWindow.webContents.send('todo:clear');
          } 
        },
        { role: 'close' }
      ]
    },
    {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { role: 'toggledevtools' },
            { type: 'separator' },
            { role: 'resetzoom' },
            { role: 'zoomin' },
            { role: 'zoomout' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
];

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: true
        }
    })

    // and load the index.html of the app.
    mainWindow.loadFile('app/index.html');

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    mainWindow.on('closed', () => app.quit());
}

function createAddWindow() {
    // Create the browser window.
    addWindow = new BrowserWindow({
        width: 800,
        height: 400,
        webPreferences: {
          nodeIntegration: true
        }
    })

    // and load the index.html of the app.
    addWindow.loadFile('app/add.html');

    addWindow.on('closed', () => addWindow = null);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function() {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('todo:submit', (e, todo) => {
    mainWindow.webContents.send('todo:submit', todo);
    addWindow.close();
})