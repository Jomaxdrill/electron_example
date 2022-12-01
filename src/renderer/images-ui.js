const url = require('url')
const path = require('path')

function addImageEvents () {
	const thumbs = document.querySelectorAll('div.photo_li')
	for (let i=0; i<thumbs.length; i++) {
		thumbs[i].addEventListener('click',function(){
			changeImage(this)
		});
	}
}

function changeImage (node) {
	if(!node){
		document.getElementById('img-displayed_main').src = "../assets/img/notfound.png"
		return
	}
	const selected = document.querySelector('div.selected')
	if (selected){
		selected.classList.remove('selected')
	}
	console.log(node.classList)
	node.classList.add('selected')
	document.getElementById('img-displayed_main').src = node.querySelector('img').src
}

function selectFirstImage (){
	const image = document.querySelector('div.photo_li:not(.hidden)')
	changeImage(image)
}

function searchImageEvents () {
	const searchBox = document.getElementById("search_img")
	searchBox.addEventListener('keyup', function () {
		const reg_exp = new RegExp(this.value.toLowerCase(),'gi')
		if(this.value.length) {
			const image_cards = document.querySelectorAll("div.photo_li div img")
			console.log(image_cards)
			const image_cards_parents = document.querySelectorAll("div.photo_li")
			for (let i=0; i<image_cards.length; i++){
				const fileUrl =  url.parse(image_cards[i].src);
				const filename = path.basename(fileUrl.pathname)
				console.log(filename)
				if (filename.match(reg_exp)){
					image_cards_parents[i].classList.remove('hidden')
				}else{
					image_cards_parents[i].classList.add('hidden')
				}
			}
			selectFirstImage()

		}else{

			document.querySelectorAll("div.photo_li").forEach((element) => {element.classList.remove('hidden')})
			document.querySelector('div.selected').classList.remove('selected')
			document.getElementById('card-img-0').classList.add('selected')
			document.getElementById('img-displayed_main').src = document.getElementById('img-displayed_0').src
		}
	})
}


function SelectFilterImage (){
	const selectFilter = document.getElementById('select_filter')
	selectFilter.addEventListener('change',function(){
		ApplyFilterImage()
	})
}

function ApplyFilterImage (){
	const gradientFilter = document.getElementById('gradient_filter')
	const selectFilter = document.getElementById('select_filter')
	if(selectFilter.value != "no_filter") {
		document.getElementById('img-displayed_main').className = ""
		document.getElementById('img-displayed_main').classList.add('img-fluid',selectFilter.value + "-" + gradientFilter.value)
		console.log(document.getElementById('img-displayed_main').className)
	}else{
		document.getElementById('img-displayed_main').className = ""
		document.getElementById('img-displayed_main').classList.add('img-fluid')
	}
}

function changeGradientFilter (){
	const gradientFilter = document.getElementById('gradient_filter')
	gradientFilter.addEventListener('change',function(){
		document.getElementById('gradient_filter_value').innerHTML = this.value
		ApplyFilterImage()
	})
}

function clearImages (){
	const old_image_cards = document.querySelectorAll("div.photo_li")
	for (let i=0; i<old_image_cards.length; i++){
		old_image_cards[i].parentNode.removeChild(old_image_cards[i])
	}
}
function loadImages (images){
	const imagesList = document.getElementById('images_list')
	for (let i=0; i< images.length; i++) {
		let node = `	<div class="card border-primary mb-3 photo_li" id="card-img-${i}" style="max-width: 17rem;">
			<div class="card-header">${images[i].filename}</div>
			<div class="card-body text-primary">
				<img id="img-displayed_${i}" src="${images[i].src}" class="img-fluid"  style="overflow:auto;max-height:195px !important;" alt="example1"/>
			</div>
			<div class="card-footer">${images[i].size}</div>
		</div>`
		imagesList.insertAdjacentHTML('beforeend',node)
	}

}

module.exports = {
    addImageEvents: addImageEvents,
    changeImage: changeImage,
    selectFirstImage: selectFirstImage,
    searchImageEvents: searchImageEvents,
    SelectFilterImage: SelectFilterImage,
    changeGradientFilter: changeGradientFilter,
    clearImages: clearImages,
    loadImages: loadImages
}