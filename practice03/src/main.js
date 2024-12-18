// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('node:path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('src/index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// IPC
const {ipcMain} = require('electron')

ipcMain.on('ping1', (event, arg) => {
    console.log('main async : ', arg)  // "ping" 출력
    event.sender.send('ping1-reply', 'pong')
})

ipcMain.on('ping2', (event, arg) => {
    console.log('main sync : ', arg)  // "ping" 출력
    event.returnValue = 'pong'
})

ipcMain.handle('ping3', async (event, arg) => {
    console.log('main handle : ', arg)  // "ping" 출력
    return 'pong';
});

const { Notification } = require('electron')

ipcMain.on('toast-message', (event, arg)=>{
    const noti = new Notification({
        title: arg.title,
        body: arg.body
    });

    noti.show()
    noti.on('click', ()=>{
        event.sender.send('toast-message-reply', 'Notification clicked!')
    })
    noti.on('close', ()=>{
        event.sender.send('toast-message-reply', 'Notification closed!')
    })
})
