var blockedWords = [];

function hideOnLoadAndScroll() {
	chrome.storage.sync.get("blockedWordList", function(result) {
		var arr = result.blockedWordList;
		arr.forEach(function(element) {
			hideText(element);
		}, this);
	});
}
$(document).ready(function() {
	hideOnLoadAndScroll()
});
$(document).scroll(function() {
	hideOnLoadAndScroll()
});

function hideText(blockText) {
	//blockText = blockText.replace(/[^\w\s]/g,'');
	var noSpaceWord = blockText.replace(/[^A-Za-z]/g, '');
	$('div.content').each(function(k, v) {
		var textToBlock = new RegExp(blockText, 'i');
		var textToBlockUsername = new RegExp(noSpaceWord, 'i');
		if ($(this).text().match(textToBlock) || $(this).text().match(textToBlockUsername)) {
			$(this).css("display", "none");
		};
	})
	if (blockedWords.indexOf(blockText) == -1) {
		blockedWords.push(blockText);
	}
	return blockedWords;
}

function showText(blockText) {
	var noSpaceWord = blockText.replace(/ /g, '');
	$('div.content').each(function(k, v) {
		var textToBlock = new RegExp(blockText, 'i');
		var textToBlockUsername = new RegExp(noSpaceWord, 'i');
		if ($(this).text().match(textToBlock) || $(this).text().match(textToBlockUsername)) {
			$(this).css("display", "block");
		};
	})
	
}
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
	if (request.type == "submit") {
		if (request.enteredText == '') {
			alert('Please enter text to block!');
		} else if (request.enteredText.search(/[$-/:-?{-~!"^_`\[\]]/) != -1) { 
			alert('Please enter words without punctuation!');
		}else {
			hideText(request.enteredText);
		}
		sendResponse({
			"array": blockedWords
		});
	}
	if (request.type == "show") {
		showText(request.buttonClicked);
		blockedWords = $.grep(blockedWords, function(value) {
			return value != request.buttonClicked;
		});
	}
	if (request.type == "load") {
		var array = request.enteredArray;
		array.forEach(function(element) {
			hideText(element);
		}, this);
	}
})