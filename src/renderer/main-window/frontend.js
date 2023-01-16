'use strict';
const os  = require('os')
const { ReceiveIpc, openDirectory, receiveImages, saveFile, openPreferences, uploadImage } = require('./main-window/IpcRendererEvents')
const {	addImageEvents, searchImageEvents, SelectFilterImage, changeGradientFilter, selectFirstImage, printFile} = require('./main-window/images-ui')
const createMenu = require('./main-window/menu')
window.addEventListener('DOMContentLoaded', ()=> {
	console.log(os.cpus())
	//ReceiveIpc()
	createMenu()
	addImageEvents()
	searchImageEvents()
	selectFirstImage ()
	SelectFilterImage()
	changeGradientFilter()
	receiveImages()
	buttonEvent('open-directory', openDirectory)
	buttonEvent('open-save-dialog', saveFile)
	buttonEvent('open-preferences', openPreferences)
	buttonEvent('print-button', printFile)
	buttonEvent('upload-button', uploadImage)
	// document.getElementById('description').innerHTML = "Mensaje insertado por el fron al hacer click "
	// const botoncito = document.createElement('button');
	// botoncito.setAttribute('id', 'botoncito')
	// botoncito.innerHTML = "OPrimeme"
	// document.getElementById('container_example').appendChild(botoncito);
	// document.getElementById('botoncito').addEventListener('click',()=>{
	//     document.getElementById('oprimido').innerHTML = "Boton oprimido";

	// });
});


function buttonEvent(id, func){
	const openDirButton = document.getElementById(id)
	openDirButton.addEventListener('click',func)
}