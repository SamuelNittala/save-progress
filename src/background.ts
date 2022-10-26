import { handleHotStarTitle } from "./otts/hotstar.js";
const EMPTY = "";
const HOTSTAR = "HOTSTAR";

function getOtt(url: chrome.tabs.Tab["url"]) {
	if (url) {
		return url.split(".")[1].toUpperCase();
	}
	return EMPTY;
}

async function handleOTT(currentTab: chrome.tabs.Tab) {
	switch (getOtt(currentTab.url)) {
		case HOTSTAR: {
			await handleHotStarTitle(currentTab);
		}
		default:
	}
}

try {
	chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
		handleOTT(tab);
	});
} catch (err) {
	console.log(err);
}
