const { ipcMain, dialog } = require('electron')
const Swal = require('sweetalert2')
const fs = require('fs')
const isImage = require('is-image')
const {filesize} = require('filesize')
const path = require('path')
function SetMainIpc(win) {

    ipcMain.on('ping', function (event,args){
        //-ipcMain.send('pong',args)
        console.log(`ping recibido aquí main process ${args}`)
        event.sender.send('pong',args)
    })
    ipcMain.on('open-directory', function (event,action,extension){
        //-ipcMain.send('pong',args)
        if(action == "load") {
            console.log(`open load directory`)
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
                loadImages(event,pathImage)
            })
            .catch(err =>{console.log(err)})
        }

        if(action == "save") {
            console.log(`open save directory`,extension)
            dialog.showSaveDialog(win, {
                title: 'Save image with applied filters',
                buttonLabel: 'Save',
                filters: [{name:'image-save', extensions:[extension]}]
            })
            .then((result) => {
                console.log(result)
                const { canceled, filePath } = result
                if(filePath.length > 0) {
                    event.sender.send('save-image',filePath, extension)
                }

                // })
            })
            .catch(err =>{console.log(err)})
        }
    })

    ipcMain.on('load-directory', function(event,path){
        loadImages(event,path)
    })


    ipcMain.on('show-dialog', (event, info)=>{
            console.log('showing message')
            dialog.showMessageBox(win,{
                message: info.message,
                type: info.type,
                title: info.title
            })
        })

}

function loadImages(event,pathImage){
    let images = []
    fs.readdir(pathImage, function (err,files) {
        if(err) {
            console.log(err)
            return
        }
        files.forEach(function (image_file) {
            if(isImage(image_file)) {
                let imageFullPath = path.join(pathImage,image_file)
                let stats = fs.statSync(imageFullPath)
                let size =  filesize(stats.size,{round: 0})
                images.push({filename: image_file ,src:`eleimg://${imageFullPath}`,size:size})
            }
        })
        console.log(images)
        event.sender.send('load-images',images,pathImage)
    })
}

module.exports = SetMainIpc