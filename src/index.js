'use strict';

const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const env = process.env.NODE_ENV || 'development'
const Swal = require('sweetalert2')
const fs = require('fs')
const isImage = require('is-image')
const {filesize} = require('filesize')
const path = require('path')
var win
// If development environment
if(env === 'development') {
    try {
        require('electron-reloader')(module, {
            debug: true
        });

    } catch (_) { console.log('Error'); }
}
console.dir(app);
app.on('before-quit', () => { console.log ('Exit....')})
app.on('ready',  () => {
    win = new BrowserWindow(
        {
            // width:900,
            // height:900,
            title: 'Ciao World',
            center: true,
            maximizable: false, //idk why it doesnt work
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true,
                },
        });
    //- Show window only when content is loaded
    win.once('ready-to-show',() => {
        win.show()
    })
    //Listen to event when window is moving
    win.on('move', () => {
        const position = win.getPosition();
        console.log(`la position es ${position}`)
    })
    //detect close of window on application
    win.on('closed', () => {
        win = null
        app.quit()
    })
    win.loadURL(`file://${__dirname}/renderer/index.html`)
    win.webContents.openDevTools()
})

ipcMain.on('ping', function (event,args){
    //-ipcMain.send('pong',args)
    console.log(`ping recibido aquí main process ${args}`)
    event.sender.send('pong',args)
})
ipcMain.on('open-directory', function (event){
    //-ipcMain.send('pong',args)
    console.log(`open directory`)
    dialog.showOpenDialog(win, {
        title: 'Open Directory',
        buttonLabel: 'Select',
        properties: ['openDirectory']
    })
    .then((result) => {
        console.log(result)
        const { canceled, filePaths } = result
        if(canceled) {
            return
        }
        const pathImage = filePaths[0]
        fs.readdir(pathImage, function (err,files) {
            if(err) {
                console.log(err)
                return
            }
            let images = []
            files.forEach(function (image_file) {
                if(isImage(image_file)) {
                    let imageFullPath = path.join(pathImage,image_file)
                    let stats = fs.statSync(imageFullPath)
                    let size =  filesize(stats.size,{round: 0})
                    images.push({filename: image_file ,src:`file://${imageFullPath}`,size:size})
                }
            })
            console.log(images)
            event.sender.send('load-images',images)
        })
    })
    .catch(err =>{console.log(err)})

})

