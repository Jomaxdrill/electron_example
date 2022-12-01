const { ipcRenderer } = require('electron');
const { clearImages,loadImages, addImageEvents, selectFirstImage} = require('./images-ui')

function ReceiveIpc(){
    ipcRenderer.on('pong', function (event,args){
        console.log(`recibi pong aquí en renderer process ${args}`)
    })

}

function receiveImages(){
    ipcRenderer.on('load-images', function (event,images){
        clearImages()
        loadImages(images)
        addImageEvents()
        selectFirstImage()
    })
}


function SendIpc(){
    ipcRenderer.send('ping', `cargar una imagen`)
}

function openDirectory(){
    ipcRenderer.send('open-directory')
}
module.exports = {
    ReceiveIpc: ReceiveIpc,
    SendIpc: SendIpc,
    openDirectory: openDirectory,
    receiveImages: receiveImages
}