'use strict';

const { app, BrowserWindow, Tray , Menu, globalShortcut, protocol} = require('electron')
const env = process.env.NODE_ENV || 'development'
const handleErrors = require('./handle-errors')
const SetMainIpc = require('./ipcMainEvents')
const Store = require('electron-store')
const os = require('os')
const path = require('path')
Store.initRenderer()
var win = null
var icon_app = null
require('@electron/remote/main').initialize()
// If development environment
if(env === 'development') {
    try {
        require('electron-reloader')(module, {
            debug: true
        });

    } catch (_) { console.log('Error'); }
}

app.on('before-quit', () => {
   // globalShortcut.unregisterAll()
    console.log ('Exit....')})
app.on('ready',  () => {
    //register protocol
    protocol.registerFileProtocol('eleimg', (request, callback) => {
        const url = request.url.substring(8) //eleimg:://....(name protocol has 9 characters)
        let myurl = decodeURIComponent(url)
        callback({path: path.normalize(myurl)}) // eslint-disable-line
    }, (err) => {
        if (err) throw err
    })
    //define an icon
    let imageToUse = os.platform() === 'win32' ? 'ico':'png'
    icon_app = path.join(__dirname, 'assets', 'icons', `icon_image.${imageToUse}`)
    var tray = new Tray(icon_app)
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show/Hide',
            click: () => {
                if( win.isVisible() ){
                    win.hide()
                }else{
                    win.show()
                }
            },
        },
    ]);
    tray.setToolTip('Electron Image')
    tray.setContextMenu(contextMenu)
    tray.on('click',() =>{
    if( win.isVisible() ) {
        win.hide()
    }  else{
        win.show()
    }
    })
    //create window
    win = new BrowserWindow(
        {
            width:900,
            height:900,
            title: 'Ciao World',
            center: true,
            maximizable: false, //idk why it doesnt work
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true,
                },
            icon: icon_app
        })
   // globalShortcut.register('Ctrl+Alt+Ñ',()=>{}) //Look for a valid shortcut that doesn't overlap with OS shorcuts
   //
    //set Main Ipc
    SetMainIpc(win)
    //setupErrors
    handleErrors(win)
    //- Show window only when content is loaded
    win.once('ready-to-show',() => {
        win.show()
    })
    //Listen to event when window is moving
    win.on('move', () => {
        console.log(app.getPath('userData'))
        const position = win.getPosition();
        console.log(`la position es ${position}`)
    })
    //detect close of window on application
    win.on('closed', () => {
        win = null
        app.quit()
    })
    require('@electron/remote/main').enable(win.webContents)
    win.loadURL(`file://${__dirname}/renderer/index.html`)
    win.webContents.openDevTools()


})
