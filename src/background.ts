import { handleHotStarTitle } from "./otts/hotstar.js";

const GET_CURRENT_TAB = "get_current_tab";
const STORE_VALUE = "store_value";
const SPACE = " ";
const EMPTY = "";
const HYPHEN = "-";
const EPISODE = "episode";
const SEASON = "season";

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
		// read changeInfo data and do something with it (like read the url)
		handleOTT(tab);
	});
} catch (err) {
	console.log(err);
}
