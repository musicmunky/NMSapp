
// Let the comments begin!

// You'll notice I moved things like the options array and the language
// definitions to a separate file to clean things up a little bit in here
// see the "constants.js" file for those JSON objects and arrays

// I moved all of the various document.ready code into this one big block
// this is mainly because otherwise it's hard to figure out what runs at what point
// when the page is loaded and helps us keep track of things a little better
$(document).ready(function () {

	// a quick function defined at the bottom that lets us see if the users are
	// viewing the page with a modern browser capable of using localStorage
	// for 99% of users this will be true, but when it's false it keeps the page
	// from breaking on load
	if(supportsHtml5Storage())
	{
		var storageColor = document.getElementById('PageName').getAttribute('data-storage');
		var storageData = document.getElementById('PageName').getAttribute('data-page');

		// as you've noticed, I don't like using a separate localStorage item for each
		// individual container - it's much easier to use one item and use the container
		// name and number as the key for the object
		var ITEMS = localStorage.getItem(storageData);
		if(ITEMS === null) {
			ITEMS = {};
			var item = {};
			for(var i = 1; i <= CONTAINERS; i++) {
				item = {"color":"",
						"notes":"",
						"slot1":{"name":"","quantity":0},
						"slot2":{"name":"","quantity":0},
						"slot3":{"name":"","quantity":0},
						"slot4":{"name":"","quantity":0},
						"slot5":{"name":"","quantity":0}};
				ITEMS['container' + i] = item;
			}
			localStorage.setItem(storageData, JSON.stringify(ITEMS));
		}
		else {
			try {
				// building out the HTML elements based on what's been stored previously...
				ITEMS = JSON.parse(ITEMS);
				var slot = {};
				var $div = "";
				for(var j = 1; j <= CONTAINERS; j++) {
					for(var i = 1; i <= SLOTS; i++) {
						slot = ITEMS['container' + j]['slot' + i];
						$div = $("div[data-id='" + j + "']").find('div[data="' + i + '"]');
						if(slot['name'] !== "" && slot['name'] !== "item"){
							$div.find("#itemIcon").attr('class', '').addClass(slot['name']);
							$div.find("#itemName").html('<span data-i18n="' + slot['name'] + '">' + slot['name'].replace(/-/gi, " ") + '</span>');
							$div.find("#qntText").html(slot['quantity']);
							$div.find("#itemList").val(slot['name']);
						}
					}
				}
			}
			catch(err) {
				console.log("error processing data: " + err.message);
			}
		}

		var getTheme;
		if (localStorage.getItem['theme-color'] !== null) {
			getTheme = localStorage['theme-color'];
			$("#theme").addClass(getTheme);
		}

		// this part I didn't change much, just the variable names mostly, and
		// also took out the string concatenation - you had 'theme' + '-color'
		// which is unnecessary.  Just use "theme-color", no need for the "+" sign
		$('.themeChange').click(function () {
			var oldTheme = localStorage.getItem('theme-color');
			var newTheme = $(this).attr("id");

			localStorage.removeItem('theme-color');
			localStorage.setItem('theme-color', newTheme);

			$("#theme").removeClass(oldTheme);
			$("#theme").addClass(newTheme);
		});

		var id = "";
		for (var container in ITEMS) {
			if(ITEMS[container]['color'] !== "") {
				try {
					// this is where I use a regular expression to grab the number
					// of the container and get the correct CSS class for the div
					// regular expressions are amazing tools!!
					id = container.match(/\d+/)[0]
					$("div[data-id='" + id + "']").addClass(ITEMS[container]['color']);
				}
				catch(err) {
					console.log("Error setting container color: " + err.message);
				}
			}
		}

		$('.palette').click(function () {
			var lsname = document.getElementById('PageName').getAttribute('data-page');
			var lsstr  = localStorage.getItem(lsname);
			var lsobj  = JSON.parse(lsstr);
			var $p = $(this).parent().parent();
			var id = $p.attr('data-id');

			var oldColour = lsobj['container' + id]['color'];
			var newColour = $(this).attr("id");

			$p.removeClass(oldColour);
			$p.addClass(newColour);
			lsobj['container' + id]['color'] = newColour;
			localStorage.setItem(lsname, JSON.stringify(lsobj));
		});

		var saveItems = document.getElementsByName('saveButton');
		var editItems = document.getElementsByName('editButton');
		var clearItems = document.getElementsByName('clearButton');
		var select = document.getElementsByName("itemSelect");

		var opt, el, i18;
		for(var i = 0; i < select.length; i++) {
			for(var j = 0; j < OPTIONS.length; j++) {
				opt = OPTIONS[j];
				el = document.createElement("option");
				i18 = document.createAttribute("data-i18n");

				//when working with select elements you need to tell it to translate
				//both the value AND the text node:
				i18.value = "[value]" + opt + ";[text]" + opt;
				el.setAttributeNode(i18);
				el.textContent = opt.replace(/-/gi, " ");
				el.value = opt;
				select[i].appendChild(el);
			}
		}

		for (var i = 0; i < saveItems.length; i++) {
			$(saveItems[i]).click(function() { saveItem(this); });
			select[i].onchange = function() { changeIcon(this); };
		}

		for (var j = 0; j < editItems.length; j++) {
			$(editItems[j]).click(function() { editItem(this); });
		}

		for (var k = 0; k < clearItems.length; k++) {
			$(clearItems[k]).click(function() { clearItem(this); });
		}

		$("input[name='qntNumber']").keyup(function() {
			var val = $(this).val().replace(/[^0-9]+/,"");
			if(!/^\s*$/.test(val)) {
				val = (parseInt(val) > 1000) ? 1000 : val;
			}
			$(this).val(val);
		});

		var language = "en";
		if (localStorage.getItem("language") !== null) {
			language = localStorage.getItem("language");
		}
		else {
			localStorage.setItem("language", language);
		}

		i18n.init({
			lng: language,
			resStore: ITEMSLANG,
			fallbackLng: "en"
		}, function(o) {
			$(document).i18n()
		});

		$(".lang").click(function() {
			var o = $(this).attr("data-lang");
			localStorage.setItem("language", o);
			i18n.init({
				lng: o
			}, function(o) {
				$(document).i18n();
			});
		});

		$(".tabs-menu a").click(function(event) {
			event.preventDefault();
			$(this).parent().addClass("current");
			$(this).parent().siblings().removeClass("current");
			var tab = $(this).attr("href");
			$(".tab-content").not(tab).css("display", "none");
			$(tab).fadeIn();
		});

		$(".alertButton").click(function() {
			closeAlert();
		});
	}
});


function saveItem(t) {
	// getting the parent element of the button and the container id
	var $p  = $(t).parent();
	var cid = $p.parent().attr('data-id');
	var storageName = document.getElementById('PageName').getAttribute('data-page');
	var items = JSON.parse(localStorage.getItem(storageName));
	var dval = $p.find("#slot").attr("data");
	var itemList = $p.find("#itemList");
	var qntNumber = $p.find("input[name='qntNumber']");
	var qntNumVal = qntNumber.val();
	var itemName = $p.find("#itemName");
	var qntText = $p.find("#qntText");
	var itemsMenu = $("#itemsMenu");

	var lang = localStorage.getItem("language");
	var qnty = ITEMSLANG[lang]['translation']['quantity'];
	// here is a check to make sure that when they click "save" there is a value
	// in both the text field and the select list
	// Otherwise it will allow users to save a number without an item selected, or
	// save an item with no number entered in for an amount
	// the regular expression test looks to see if the number is blank or equals zero
	// and if so just sets the text for the span/select back to "Quantity" and select
	// as it should
	if(itemList.val() === "item" && !/^\s*$/.test(qntNumVal)) {
		showAlert();
		return false;
	}

	if(/^\s*$/.test(qntNumVal) || parseInt(qntNumVal) === 0) {
		qntNumVal = qnty;
	}

	var i18nstr = itemList.find(":selected").attr("data-i18n");
	var element = i18nstr.match(/\[value](\w+(-\w+)*);/)[1];
	$p.find("#itemIcon").attr('class', '').addClass(element);
	$p.find("#itemName").html('<span data-i18n="' + element + '">' + itemList.val().replace(/-/gi, " ") + '</span>');
	$p.find("#qntText").html(qntNumVal);

	items['container' + cid]['slot' + dval]['name'] = element;
	items['container' + cid]['slot' + dval]['quantity'] = (qntNumVal === qnty) ? 0 : qntNumVal;
	localStorage.setItem(storageName, JSON.stringify(items));

	itemList.addClass("hide");
	itemsMenu.addClass("hide");
	qntNumber.addClass("hide");
	qntNumber.removeClass("qntNumber");
	itemName.removeClass("hide");
	itemName.addClass("name");
	qntText.addClass("quantity");
	qntText.removeClass("hide");
	$p.find("button[name='saveButton']").addClass("hide");
	$p.find("button[name='clearButton']").addClass("hide");
	$p.find("button[name='editButton']").removeClass("hide");
}


function editItem(t) {
	var $p = $(t).parent();
	var cid = $p.parent().attr('data-id');
	var storageData = document.getElementById('PageName').getAttribute('data-page');
	var items = JSON.parse(localStorage.getItem(storageData));
	var dval = $p.find("#slot").attr("data");
	var itemList = $p.find("#itemList");
	var itemsMenu = $p.find("#itemsMenu");
	var qntNumber = $p.find("input[name='qntNumber']");

	if(items['container' + cid]['slot' + dval]['name'] !== "") {
		var ename = items['container' + cid]['slot' + dval]['name'];
		var option = itemList.find("option[data-i18n='[value]" + ename + ";[text]" + ename + "']");
		itemList.val(option.val());
	}

	if(parseInt(items['container' + cid]['slot' + dval]['quantity']) !== 0) {
		qntNumber.val(items['container' + cid]['slot' + dval]['quantity']);
	}

	$p.find("#itemList").removeClass("hide");
	$("#itemsMenu").removeClass("hide");
	qntNumber.addClass("qntNumber");
	qntNumber.removeClass("hide");

	$p.find("button[name='saveButton']").removeClass("hide");
	$p.find("button[name='clearButton']").removeClass("hide");
	$p.find("#itemName").addClass("hide");
	$p.find("#qntText").addClass("hide");
	$p.find("button[name='editButton']").addClass("hide");
}


function clearItem(t) {
	var $p = $(t).parent();
	var cid = $p.parent().attr('data-id');
	var storageData = document.getElementById('PageName').getAttribute('data-page');
	var items = JSON.parse(localStorage.getItem(storageData));
	var dval = $p.find("#slot").attr("data");
	var itemList  = $p.find("#itemList");
	var qntNumber = $p.find("input[name='qntNumber']");
	var itemName  = $p.find("#itemName");
	var qntText   = $p.find("#qntText");
	var itemsMenu = $("#itemsMenu");

	itemList.val("item");
	qntNumber.val("");

	$p.find("#itemIcon").attr('class', '').addClass("item");
	$p.find("#itemName").html('<span data-i18n="Item">Item</span>');
	$p.find("#qntText").html('<span data-i18n="Quantity">Quantity</span>');

	items['container' + cid]['slot' + dval]['name'] = "";
	items['container' + cid]['slot' + dval]['quantity'] = 0;
	localStorage.setItem(storageData, JSON.stringify(items));

	itemList.addClass("hide");
	itemsMenu.addClass("hide");
	qntNumber.removeClass("qntNumber");
	qntNumber.addClass("hide");
	itemName.removeClass("hide");
	itemName.addClass("name");
	qntText.addClass("quantity");
	qntText.removeClass("hide");

	$p.find("button[name='saveButton']").addClass("hide");
	$p.find("button[name='clearButton']").addClass("hide");
	$p.find("button[name='editButton']").removeClass("hide");
}


function changeIcon(t) {
	var $p = $(t).parent();
	var i18nstr = $p.find("#itemList").find(":selected").attr("data-i18n");
	if(!/^\s*$/.test(i18nstr) && i18nstr !== undefined) {
		var clss = i18nstr.match(/\[value](\w+(-\w+)*);/)[1];
		$p.find("#itemIcon").attr('class', '').addClass(clss);
	}
	else {
		$p.find("#itemIcon").attr('class', '').addClass("item");
	}
}


function showAlert() {
	var adiv = document.createElement("div");
	adiv.setAttribute("id", "itemAlert");
	adiv.setAttribute("class", "absolute-center is-fixed");

	var tspn = document.createElement("span");
	tspn.setAttribute("class", "alertTitle");
	tspn.setAttribute("data-i18n", "AlertTitle");
	tspn.innerHTML = "Warning!";

	var aspn = document.createElement("span");
	aspn.setAttribute("class", "alertText");
	aspn.setAttribute("data-i18n", "AlertText");
	aspn.innerHTML = "Please select an item!";

	var abtn = document.createElement("span");
	abtn.setAttribute("data-i18n", "AlertTextClose");

	abtn.innerHTML = "Close";
	abtn.setAttribute("class", "alertButton");
	abtn.onclick = new Function("closeAlert()");

	var odiv = document.createElement("div");
	odiv.setAttribute("class", "alertOverlay");
	odiv.setAttribute("id", "alertOverlayDiv");
	odiv.style['display'] = "block";


	adiv.appendChild(tspn);
	adiv.appendChild(aspn);
	adiv.appendChild(abtn);
	odiv.appendChild(adiv);
	document.body.appendChild(odiv);
}


function closeAlert() {
	try {
		var elm = document.getElementById("alertOverlayDiv");
		if(elm !== null) {
			var par = elm.parentNode;
			par.removeChild(elm);
		}
		return true;
	}
	catch(err) {
		console.log("Error removing overlay div: " + err.message);
		return false;
	}

}


function supportsHtml5Storage()
{
	//generic function to check if the browser can handle
	//and use localStorage, or if they're living in the stone age
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	}
	catch(err) {
		console.log("Error determining if browser supports HTML5 Storage: " + err.message);
		return false;
	}
}




/*
// Let the comments begin!

// You'll notice I moved things like the options array and the language
// definitions to a separate file to clean things up a little bit in here
// see the "constants.js" file for those JSON objects and arrays

// I moved all of the various document.ready code into this one big block
// this is mainly because otherwise it's hard to figure out what runs at what point
// when the page is loaded and helps us keep track of things a little better
$(document).ready(function () {

	// a quick function defined at the bottom that lets us see if the users are
	// viewing the page with a modern browser capable of using localStorage
	// for 99% of users this will be true, but when it's false it keeps the page
	// from breaking on load
	if(supportsHtml5Storage())
	{
		var lstorage = document.getElementById('PageName').getAttribute('data-page');

		// as you've noticed, I don't like using a separate localStorage item for each
		// individual container - it's much easier to use one item and use the container
		// name and number as the key for the object
		var ITEMS = localStorage.getItem(lstorage);
		if(ITEMS === null) {
			ITEMS = {};
			var item = {};
			for(var i = 1; i <= CONTAINERS; i++) {
				item = {"color":"",
						"notes":"",
						"slot1":{"name":"","quantity":0},
						"slot2":{"name":"","quantity":0},
						"slot3":{"name":"","quantity":0},
						"slot4":{"name":"","quantity":0},
						"slot5":{"name":"","quantity":0}};
				ITEMS['container' + i] = item;
			}
			localStorage.setItem(lstorage, JSON.stringify(ITEMS));
		}
		else {
			try {
				// building out the HTML elements based on what's been stored previously...
				ITEMS = JSON.parse(ITEMS);
				var slot = {};
				var $div = "";
				for(var j = 1; j <= CONTAINERS; j++) {
					for(var i = 1; i <= SLOTS; i++) {
						slot = ITEMS['container' + j]['slot' + i];
						$div = $("div[data-id='" + j + "']").find('div[data="' + i + '"]');
						if(slot['name'] !== "" && slot['name'] !== "item"){
							$div.find("#itemIcon").attr('class', '').addClass(slot['name']);
							$div.find("#itemName").html('<span data-i18n="' + slot['name'] + '">' + slot['name'].replace(/-/gi, " ") + '</span>');
							$div.find("#qntText").html(slot['quantity']);
							$div.find("#itemList").val(slot['name']);
						}
					}
				}
			}
			catch(err) {
				console.log("error processing data: " + err.message);
			}
		}

		var getTheme;
		if (localStorage.getItem['theme-color'] !== null) {
			getTheme = localStorage['theme-color'];
			$("#theme").addClass(getTheme);
		}

		// this part I didn't change much, just the variable names mostly, and
		// also took out the string concatenation - you had 'theme' + '-color'
		// which is unnecessary.  Just use "theme-color", no need for the "+" sign
		$('.themeChange').click(function () {
			var oldTheme = localStorage.getItem('theme-color');
			var newTheme = $(this).attr("id");

			localStorage.removeItem('theme-color');
			localStorage.setItem('theme-color', newTheme);

			$("#theme").removeClass(oldTheme);
			$("#theme").addClass(newTheme);
		});

		var id = "";
		for (var container in ITEMS) {
			if(ITEMS[container]['color'] !== "") {
				try {
					// this is where I use a regular expression to grab the number
					// of the container and get the correct CSS class for the div
					// regular expressions are amazing tools!!
					id = container.match(/\d+/)[0]
					$("div[data-id='" + id + "']").addClass(ITEMS[container]['color']);
				}
				catch(err) {
					console.log("Error setting container color: " + err.message);
				}
			}
		}

		$('.palette').click(function () {
			var lsname 	= document.getElementById('PageName').getAttribute('data-page');
			var lsstr 	= localStorage.getItem(lsname);
			var lsobj 	= JSON.parse(lsstr);
			var $p 		= $(this).parent().parent();
			var id 		= $p.attr('data-id');

			var oldColour = lsobj['container' + id]['color'];
			var newColour = $(this).attr("id");

			$p.removeClass(oldColour);
			$p.addClass(newColour);
			lsobj['container' + id]['color'] = newColour;
			localStorage.setItem(lsname, JSON.stringify(lsobj));
		});

		var saveItems = document.getElementsByName('saveButton');
		var editItems = document.getElementsByName('editButton');
		var clearItems = document.getElementsByName('clearButton');
		var select = document.getElementsByName("itemSelect");

		var opt, el, i18;
		for(var i = 0; i < select.length; i++) {
			for(var j = 0; j < OPTIONS.length; j++) {
				opt = OPTIONS[j];
				el  = document.createElement("option");
				i18 = document.createAttribute("data-i18n");

				//when working with select elements you need to tell it to translate
				//both the value AND the text node:
				i18.value = "[value]" + opt + ";[text]" + opt;
				el.setAttributeNode(i18);
				el.textContent = opt.replace(/-/gi, " ");
				el.value = opt;
				select[i].appendChild(el);
			}
		}

		for (var i = 0; i < saveItems.length; i++) {
			$(saveItems[i]).click(function() { saveItem(this); });
			select[i].onchange = function() { changeIcon(this); };
		}

		for (var j = 0; j < editItems.length; j++) {
			$(editItems[j]).click(function() { editItem(this); });
		}

		for (var k = 0; k < clearItems.length; k++) {
			$(clearItems[k]).click(function() { clearItem(this); });
		}

		$("input[name='qntNumber']").keyup(function() {
			var val = $(this).val().replace(/[^0-9]+/,"");
			if(!/^\s*$/.test(val)) {
				val = (parseInt(val) > 1000) ? 1000 : val;
			}
			$(this).val(val);
		});

		var language = "en";
		if (localStorage.getItem("language") != null) {
			language = localStorage.getItem("language");
		}

		i18n.init({
			lng: language,
			resStore: ITEMSLANG,
			fallbackLng: "en"
		}, function(o) {
			$(document).i18n()
		});

		$(".lang").click(function() {
			var o = $(this).attr("data-lang");
			localStorage.setItem("language", o);
			i18n.init({
				lng: o
			}, function(o) {
				$(document).i18n();
			});
		});

	}
});


function saveItem(t) {
	// getting the parent element of the button and the container id
	var $p  		= $(t).parent();
	var cid 		= $p.parent().attr('data-id');
	var lstorage 	= document.getElementById('PageName').getAttribute('data-page');
	var items 		= JSON.parse(localStorage.getItem(lstorage));
	var dval 		= $p.find("#slot").attr("data");
	var itemList 	= $p.find("#itemList");
	var qntNumber 	= $p.find("input[name='qntNumber']");
	var qntNumVal 	= qntNumber.val();
	var itemName 	= $p.find("#itemName");
	var qntText 	= $p.find("#qntText");

	var lang = localStorage.getItem("language");
	var qnty = ITEMSLANG[lang]['translation']['quantity'];

	// here is a check to make sure that when they click "save" there is a value
	// in both the text field and the select list
	// Otherwise it will allow users to save a number without an item selected, or
	// save an item with no number entered in for an amount
	// the regular expression test looks to see if the number is blank or equals zero
	// and if so just sets the text for the span/select back to "Quantity" and select
	// as it should
	if(itemList.val() === "item" && !/^\s*$/.test(qntNumVal)) {
		showAlert();
		return false;
	}

	if(/^\s*$/.test(qntNumVal) || parseInt(qntNumVal) === 0) {
		qntNumVal = qnty;
	}

	var i18nstr = itemList.find(":selected").attr("data-i18n");
	var element = i18nstr.match(/\[value](\w+(-\w+)*);/)[1];
	$p.find("#itemIcon").attr('class', '').addClass(element);
	$p.find("#itemName").html('<span data-i18n="' + element + '">' + itemList.val().replace(/-/gi, " ") + '</span>');
	$p.find("#qntText").html(qntNumVal);

	items['container' + cid]['slot' + dval]['name'] = element;
	items['container' + cid]['slot' + dval]['quantity'] = (qntNumVal === qnty) ? 0 : qntNumVal;
	localStorage.setItem(lstorage, JSON.stringify(items));

	itemList.addClass("hide");
	qntNumber.addClass("hide");
	qntNumber.removeClass("qntNumber");
	itemName.removeClass("hide");
	itemName.addClass("name");
	qntText.addClass("quantity");
	qntText.removeClass("hide");
	$p.find("button[name='saveButton']").addClass("hide");
	$p.find("button[name='clearButton']").addClass("hide");
	$p.find("button[name='editButton']").removeClass("hide");
}


function editItem(t) {
	var $p = $(t).parent();
	var cid = $p.parent().attr('data-id');
	var lstorage = document.getElementById('PageName').getAttribute('data-page');
	var items = JSON.parse(localStorage.getItem(lstorage));
	var dval = $p.find("#slot").attr("data");
	var itemList = $p.find("#itemList");
	var qntNumber = $p.find("input[name='qntNumber']");

	if(items['container' + cid]['slot' + dval]['name'] !== "") {
		var ename = items['container' + cid]['slot' + dval]['name'];
		var option = itemList.find("option[data-i18n='[value]" + ename + ";[text]" + ename + "']");
		itemList.val(option.val());
	}

	if(parseInt(items['container' + cid]['slot' + dval]['quantity']) !== 0) {
		qntNumber.val(items['container' + cid]['slot' + dval]['quantity']);
	}

	$p.find("#itemList").removeClass("hide");
	qntNumber.addClass("qntNumber");
	qntNumber.removeClass("hide");

	$p.find("button[name='saveButton']").removeClass("hide");
	$p.find("button[name='clearButton']").removeClass("hide");
	$p.find("#itemName").addClass("hide");
	$p.find("#qntText").addClass("hide");
	$p.find("button[name='editButton']").addClass("hide");
}


function clearItem(t) {
	var $p = $(t).parent();
	var cid = $p.parent().attr('data-id');
	var lstorage = document.getElementById('PageName').getAttribute('data-page');
	var items = JSON.parse(localStorage.getItem(lstorage));
	var dval = $p.find("#slot").attr("data");
	var itemList  = $p.find("#itemList");
	var qntNumber = $p.find("input[name='qntNumber']");
	var itemName  = $p.find("#itemName");
	var qntText   = $p.find("#qntText");

	itemList.val("item");
	qntNumber.val("");

	$p.find("#itemIcon").attr('class', '').addClass("item");
	$p.find("#itemName").html('<span data-i18n="Item">Item</span>');
	$p.find("#qntText").html('<span data-i18n="Quantity">Quantity</span>');

	items['container' + cid]['slot' + dval]['name'] = "";
	items['container' + cid]['slot' + dval]['quantity'] = 0;
	localStorage.setItem(lstorage, JSON.stringify(items));

	itemList.addClass("hide");
	qntNumber.removeClass("qntNumber");
	qntNumber.addClass("hide");
	itemName.removeClass("hide");
	itemName.addClass("name");
	qntText.addClass("quantity");
	qntText.removeClass("hide");

	$p.find("button[name='saveButton']").addClass("hide");
	$p.find("button[name='clearButton']").addClass("hide");
	$p.find("button[name='editButton']").removeClass("hide");
}


function changeIcon(t) {
	var $p = $(t).parent();
	var i18nstr = $p.find("#itemList").find(":selected").attr("data-i18n");
	if(!/^\s*$/.test(i18nstr) && i18nstr !== undefined) {
		var clss = i18nstr.match(/\[value](\w+(-\w+)*);/)[1];
		$p.find("#itemIcon").attr('class', '').addClass(clss);
	}
	else {
		$p.find("#itemIcon").attr('class', '').addClass("item");
	}
}


function showAlert() {
	var adiv = document.createElement("div");
	adiv.setAttribute("id", "itemAlert");
	adiv.setAttribute("class", "absolute-center is-fixed");

	var aspn = document.createElement("span");
	aspn.setAttribute("class", "alertText");
	aspn.setAttribute("data-i18n", "AlertText");
	aspn.innerHTML = "Please select an item!";

	var abtn = document.createElement("input");
	abtn.setAttribute("type", "button");
	abtn.setAttribute("value", "Okay");
	abtn.setAttribute("class", "alertButton");
	abtn.onclick = new Function("closeAlert()");

	var odiv = document.createElement("div");
	odiv.setAttribute("class", "alertOverlay");
	odiv.setAttribute("id", "alertOverlayDiv");
	odiv.style['display'] = "block";
	odiv.style['height'] = "100%";

	adiv.appendChild(aspn);
	adiv.appendChild(abtn);
	odiv.appendChild(adiv);
	document.body.appendChild(odiv);
}


function closeAlert() {
	try {
		var elm = document.getElementById("alertOverlayDiv");
		if(elm !== null) {
			var par = elm.parentNode;
			par.removeChild(elm);
		}
		return true;
	}
	catch(err) {
		console.log("Error removing overlay div: " + err.message);
		return false;
	}

}


function supportsHtml5Storage()
{
	//generic function to check if the browser can handle
	//and use localStorage, or if they're living in the stone age
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	}
	catch(err) {
		console.log("Error determining if browser supports HTML5 Storage: " + err.message);
		return false;
	}
}
*/
