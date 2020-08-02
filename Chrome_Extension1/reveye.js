/**
 *DISCLAIMER: Any Part or segment of the comments presented as documentation cannot be modified or removed without the proper permission from the current author. If any of the documentation in the public domain is found without proper credits and permission of the author, it will be dealt as plagiarism of the original code. However, part of the codes can be customized and used as per needs without any permission for personal use.
 *Author: GARGEE SRIVASTAVA
 *Contact details: srivastava.gargee@gmail.com
 *Developed for: Affective Computing Team, IIT-Guwahati for development of vedinkakSa, a sensitive classroom application.
 */
var services = {
  "all": ["all", "All search engines", "", "image"],
  "google": ["Google", "Google search", "http://www.google.com/searchbyimage?image_url=", "image"],
  "bing": ["Bing", "Bing image match", "https://www.bing.com/images/searchbyimage?cbir=ssbi&pageurl=http%3A%2F%2Fwww.squobble.com&imgurl=", "image"],
  "yandex": ["Yandex", "Yandex search", "https://yandex.com/images/search?rpt=imageview&img_url=", "image"],
  "tineye": ["TinEye", "TinEye search", "http://www.tineye.com/search/?url=", "image","page"]
};
	
function contextClick(info, tab){
	var query = info.pageUrl;
	if(info.mediaType=="image"){
		var query = info.srcUrl;
	}
	imageSearch(menus[info.menuItemId], query);
}

function open_url(url) {
	chrome.tabs.create({url: url, selected: false});
}

function imageSearch(service, query){
	if (service=="all"){
		for(var s in services){
			if (s!="all"){
				openService(s,query);
			}
		}
	} else {
		openService(service,query);
	}
}

function openService(service,query){
	var baseUrl = services[service][2];
	open_url(baseUrl + encodeURIComponent(query));
}

function create_submenu() {
	var rootmenu = chrome.contextMenus.create({
	  "title" : "Reverse image search",
	  "type" : "normal",
	  "contexts" : ["image","page"]
	});
		
	for(var s in services){
		var mymenu = chrome.contextMenus.create({
	    title: services[s][1],
	    type: "normal",
	    contexts: services[s].slice(3),
	    parentId: rootmenu,
	    onclick: contextClick
	  })	  
	  menus[mymenu] = s;
	}
}

function create_singleoption() {
	service = services[localStorage.service];
	var imageMenu = chrome.contextMenus.create({
		"title" : "Reverse image search ("+service[0]+")",
		"type" : "normal",
	  "contexts" : service.slice(3),
	  "onclick" : contextClick
	});
	menus[imageMenu] = localStorage.service;
}

function updateContextMenu() {
	chrome.contextMenus.removeAll();
	switch(localStorage.menutype) {
		case "submenu":
			create_submenu();
			break;
		case "singleoption":
			create_singleoption();
			break;
		default:
			create_submenu();
	}
}

menus = {};

updateContextMenu();

chrome.extension.onRequest.addListener(
  function(request) {
	switch(request.action){
		case "updateContextMenu" : 
			updateContextMenu();
			break;
	}
});
