const { ipcRenderer, clipboard, shell } = require('electron')
const { clearImages,loadImages, addImageEvents, selectFirstImage, saveImage} = require('./images-ui')
const path = require('path')
const { BrowserWindow } = require('@electron/remote')
const Store = require('electron-store')
const store_prefs = new Store()
var Cloudup = require('cloudup-client')
var  CryptoJS  = require("crypto-js")
function ReceiveIpc(){
    ipcRenderer.on('pong', function (event,args){
        console.log(`recibi pong aquí en renderer process ${args}`)
    })
}
var preferencesWin = null
function receiveImages(){
    if(store_prefs.has('path_image')){
        ipcRenderer.send('load-directory',store_prefs.get('path_image'))
    }
    ipcRenderer.on('load-images', function (event,images,path_image){
        clearImages()
        loadImages(images)
        addImageEvents()
        selectFirstImage()
        store_prefs.set('path_image',path_image)
        console.log(store_prefs.get('path_image'))
        document.getElementById('directory-images').innerHTML = path_image
    })
    ipcRenderer.on('save-image',(event,filePath, extension) => {
        console.log(`filepath is ${filePath}`)
        saveImage(filePath, extension, (err)=>{
            if(err){
                return showMessage('error','Electron image', err.message)
            }
            showMessage('info','Electron image', 'Image saved.')
        })
    })
}


function SendIpc(){
    ipcRenderer.send('ping', `cargar una imagen`)
}

function openDirectory(){
    ipcRenderer.send('open-directory','load','-')
}

function saveFile(){
    const image_displayed = document.getElementById('img-displayed-main')
    const extension = path.extname(image_displayed.src).slice(1)
    convertImage(image_displayed)
    ipcRenderer.send('open-directory','save', extension)
}

function convertImage(image_displayed){
    console.log(image_displayed)
    const class_filter_value = image_displayed.classList.item(1)
    //convert to canvas for save it with css filters applied
    const canvas = document.getElementById('canvas')
    canvas.setAttribute("width", image_displayed.width)
    canvas.setAttribute("height", image_displayed.height)
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0,0,canvas.width, canvas.height)
    if (class_filter_value) {
    const filter_value = class_filter_value.split('-')
    const filter_prop ={
        'blur': `blur(${filter_value[1]}px)`,
        'grayscale': `grayscale(${filter_value[1]/10})`,
        'brightness': `brightness(${filter_value[1]*20}%)`,
        'invert': `invert(${filter_value[1]*10}%)`,
        'saturate': `saturate(${filter_value[1]*10}%)`,
        'sepia': `sepia(${filter_value[1]*10}%)`,
        'opacity': `opacity(${filter_value[1]/10})`
    }
    ctx.filter = filter_prop[filter_value[0]]
    }
    // var hRatio = canvas.width  / image_displayed.width
    // var vRatio =  canvas.height / image_displayed.height
    // var ratio  = Math.min( hRatio, vRatio )
    // var centerShift_x = ( canvas.width - image_displayed.width*ratio ) / 2
    // var centerShift_y = ( canvas.height - image_displayed.height*ratio ) / 2
    ctx.drawImage(image_displayed, 0,0, image_displayed.width, image_displayed.height)
}

function showMessage(type, title, message) {
    ipcRenderer.send('show-dialog',{type:type, title:title, message:message})
}


function openPreferences(){

    preferencesWin = new BrowserWindow({
        width:400,
        height:300,
        title: 'Preferences',
        center:true,
        modal:true,
        show:false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })
    preferencesWin.once('ready-to-show',()=>{
        preferencesWin.show()
        preferencesWin.focus()
        preferencesWin.webContents.openDevTools()
    })
    preferencesWin.loadURL(`file://${path.join(__dirname, '..')}/preferences.html`)
}

function uploadImage(){

    let image_displayed = document.getElementById('img-displayed-main')
    convertImage(image_displayed)
    let canvas = document.getElementById('canvas')
    let image_displayed_url = canvas.toDataURL()
    image_displayed_original_url = image_displayed.replace('eleimg://','')
    const filename = path.basename(image_displayed_original_url)
    let passwd = ""
    if(!store_prefs.has('cloud')){
        showMessage('error', 'Electron Image', 'missing username or password. Set it from settings.')
        document.getElementById('cloudup-load').style.display = "block"
        return
    }
    let bytes_passwd = CryptoJS.AES.decrypt(store_prefs.get('cloudup.passwd'), 'ElectronImage')
    let original_passwd = bytes_passwd.toString(CryptoJS.enc.Utf8)
    passwd = original_passwd

    var client = Cloudup({
        user: store_prefs.get('cloudup.user'),
        pass: passwd
        })

    client
    .stream({ title: `Electron Image ${filename}` })
    .file(image_displayed_url)
    .save(function(err){
        document.getElementById('cloudup-load').style.display = "none"
        if(err){
            showMessage('error', 'Electron Image', err)
            return
        }
        clipboard.writeText(client.stream.url)
        var notify = new Notification('Electron Image', {
            body:`Upload Complete. Link is ${client.stream.url} copied to clipboard.`,
            silent: false,
        })

        notify.onclick = (event) => {
            event.preventDefault(); // prevent the browser from focusing the Notification's tab
            shell.openExternal(client.stream.url)
        }
        showMessage('info', 'Electron Image', `Upload Complete. Link is ${client.stream.url} copied to clipboard.`+`Click to copy URL.`)
    })
}

function pasteImage() {
    const image = clipboard.readImage()
    const data = image.toDataURL()
    if(data.indexOf('data:image/png;base64') !== -1 && !image.isEmpty()){
        let image_displayed = document.getElementById('img-displayed-main')
        image_displayed.src = data

    }else{
        showMessage('error', 'Electron Image', 'no valid image on clipboard')
    }
}

module.exports = {
    ReceiveIpc: ReceiveIpc,
    SendIpc: SendIpc,
    openDirectory: openDirectory,
    openPreferences: openPreferences,
    receiveImages: receiveImages,
    saveFile: saveFile,
    showMessage: showMessage,
    uploadImage: uploadImage,
    pasteImage:pasteImage
}