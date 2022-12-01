'use strict';
const os  = require('os')
const { ReceiveIpc, openDirectory, receiveImages } = require('./IpcRendererEvents')
const {	addImageEvents, searchImageEvents, SelectFilterImage, changeGradientFilter} = require('./images-ui')
window.addEventListener('load', ()=> {
	console.log(os.cpus())
	ReceiveIpc()
	addImageEvents()
	searchImageEvents()
	SelectFilterImage()
	changeGradientFilter()
	receiveImages()
	buttonEvent('open-directory', openDirectory)
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