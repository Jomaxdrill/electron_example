const {app, dialog} = require('electron')
function relaunchApp(win){
    dialog.showMessageBox(win, {
        type: 'error',
        title: 'Electron Image',
        message: 'Application suddenly not responding. Reload app'
    },()=>{
        app.relaunch()
        app.exit(0)
    })
}

function setupErrors(win){
    win.webContents.on('crashed',()=>{
        relaunchApp(win)
    })
    win.on('unresponsive',()=>{
        dialog.showMessageBox(win,{
            type: 'warning',
            title: 'Electron Image',
            message: 'App not responding correctly. Wait for response. If crashed, app will relaunch.'
        })
    })
    process.on('uncaughtException', () => {
        relaunchApp(win)
      })
}
module.exports = setupErrors