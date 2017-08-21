var blockedWordList = [];
var _AnalyticsCode = 'UA-104688675-1';
$(document).ready(function() {
	$(".redirect").hide();
	chrome.tabs.getSelected(null, function(tab) {
		var myURL = tab.url;
		var twitter = "twitter";
		if (myURL.indexOf(twitter) == -1) {
			$(".center").hide();
			$(".redirect").show();
		} else {
			(".center").show();
			$(".redirect").hide();
		}
	});
	if (blockedWordList == []) {
		updateHTML(blockedWordList);
	}
	chrome.storage.sync.get("blockedWordList", function(result) {
		blockedWordList = result.blockedWordList;
		updateHTML(blockedWordList);
		onLoadHideBlockedWords(blockedWordList);
	});
	$('.block').click(function() {
		hideTweets();
	});
	$(document).keypress(function(e) {
		var text = $('#text-to-block').val();
		if (e.which == 13 && text != '') {
			$('.block').click();
		}
	});
	$("a.twitter").click(function() {
		chrome.tabs.create({
			url: "http://www.twitter.com"
		});
	})

	function onLoadHideBlockedWords(blockedWordArray) {
		var array = blockedWordArray;
		chrome.tabs.query({
			active: true,
			currentWindow: true
		}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {
				enteredArray: array,
				type: "load"
			}, function(response) {
				//console.log(response.array);
			})
		})
	}

	function hideTweets() {
		var text = $('#text-to-block').val();
		$('#text-to-block').val('');
		chrome.tabs.query({
			active: true,
			currentWindow: true
		}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {
				enteredText: text,
				type: "submit"
			}, function(response) {
				blockedWordList = response.array;
				updateHTML(blockedWordList);
			})
		})
	}

	function updateHTML(blockedWords) {
		if (blockedWords != null) {
			$(".list").empty();
			blockedWords.forEach(function(element) {
				elementNoSpace = element.replace(/\s/g, '');
				console.log(elementNoSpace);
				$(".list").append("<li class='buttonList button " + elementNoSpace + "'><button class='textBlocked' type='button'>" + element + "<div class='cross'>&#x2716;</div></button><br/></li>");
				$(".cross").hide();
				addButtonClick(elementNoSpace);
				addHover(elementNoSpace);
			});
			chrome.storage.sync.set({
				"blockedWordList": blockedWords
			}, function() {
				console.log(blockedWords);
				console.log("Blocked words saved");
			});
		}
	}

	function addButtonClick(element) {
		$("." + element + "").click(function() {
			var itemToRemove = $(this).text();
			itemToRemove = itemToRemove.substring(0, itemToRemove.length - 1);
			chrome.tabs.query({
				active: true,
				currentWindow: true
			}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {
					buttonClicked: itemToRemove,
					type: "show"
				}, function(response) {
					updateHTML(blockedWordList);
				})
			})
			blockedWordList = $.grep(blockedWordList, function(value) {
				return value != itemToRemove;
			});
			$(this).remove();
		})
	}

	function addHover(element) {
		$("button", "." + element).hover(function() {
			$(".cross", this).css("background-color", "#838B8B")
			$(".cross", this).show();
		}, function() {
			$(".cross", this).css("background-color", "#1da1f2")
			$(".cross", this).hide();
		})
	}
})
var _gaq = _gaq || [];
_gaq.push(['_setAccount', _AnalyticsCode]);
_gaq.push(['_trackPageview']);
(function() {
	var ga = document.createElement('script');
	ga.type = 'text/javascript';
	ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(ga, s);
})();