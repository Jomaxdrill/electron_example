const  remote  = require('@electron/remote')
const { ipcRenderer } = require('electron')
const Store = require('electron-store')
const store_prefs = new Store();
var  CryptoJS  = require("crypto-js")
window.addEventListener('load', () => {
   // console.log(remote.getCurrentWindow())
    cancelButton()
    saveButton()
    if(store_prefs.has('cloudup')){
        document.getElementById('cloudup-user').value = store_prefs.get('cloudup.user')
        let bytes_passwd = CryptoJS.AES.decrypt(store_prefs.get('cloudup.passwd'), 'ElectronImage')
        let original_passwd = bytes_passwd.toString(CryptoJS.enc.Utf8)
        document.getElementById('cloudup-passwd').value = original_passwd
    }
})
function cancelButton() {
    const cancelButton = document.getElementById('cancel-button')
    cancelButton.addEventListener('click', () =>{
    window.close()
    })
}

function saveButton() {
    const saveButton = document.getElementById('save-button')
    const prefsForm = document.getElementById('preferences-form')
    saveButton.addEventListener('click', () =>{
        if(prefsForm.reportValidity()) {
            const encrypt_passwd = CryptoJS.AES.encrypt(document.getElementById('cloudup-passwd').value, 'ElectronImage').toString()
            store_prefs.set('cloudup.user',document.getElementById('cloudup-user').value)
            store_prefs.set('cloudup.passwd',encrypt_passwd)
            window.close()
        }else{
            ipcRenderer.send('show-dialog',{type:'error', title:'Electron Image', message:'Please fill the required fields.'})
        }
    })
}
