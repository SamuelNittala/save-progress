import { HotstarTitle } from "./otts/hotstar.js";
const EMPTY = "";
const HOTSTAR = "HOTSTAR";

function getOtt(url: chrome.tabs.Tab["url"]) {
	if (url) {
		return url.split(".")[1].toUpperCase();
	}
	return EMPTY;
}

async function handleOTT({url , title}: chrome.tabs.Tab) {
	if (url && title) {
		switch (getOtt(url)) {
			case HOTSTAR: {
				const hotStarTitle = new HotstarTitle(url, title);
				await hotStarTitle.eval();
			}
			default:
		}
	}
}

try {
	chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
		handleOTT(tab);
	});
} catch (err) {
	console.log(err);
}
