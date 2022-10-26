const GET_CURRENT_TAB = "get_current_tab";
const STORE_VALUE = "store_value";
const SPACE = " ";
const EMPTY = "";
const HYPHEN = "-";
const EPISODE = "episode";
const SEASON = "season";

export async function handleHotStarTitle(currentTab) {

	function formatString(string) {
		return string.replaceAll(SPACE, EMPTY).toLowerCase();
	}

	function isTitleValid(title) {
		const formattedTitle = formatString(title);
		return (
			formattedTitle.search(EPISODE) !== -1 &&
			formattedTitle.search("episodes") === -1 &&
			formattedTitle.search(SEASON) !== -1
		);
	}

	function getSeriesName(url) {
		return url.split("/")[5].replace("-", "_");
	}

	function getNumbersFromTitle(key, formattedTitle) {
		return formattedTitle
			.slice(formattedTitle.search(key) + key.length)
			.split(EMPTY)
			.reduce(
				(prev, curr) => {
					if (!prev.hitCharFlag) {
						return !isNaN(curr)
							? { ...prev, value: `${prev.value}${curr}` }
							: { ...prev, hitCharFlag: true };
					}
					return prev;
				},
				{ hitCharFlag: false, value: "" }
			).value;
	}

	function convertToSEKey(formattedTitle) {
		const episode = getNumbersFromTitle(EPISODE, formattedTitle);
		const season = getNumbersFromTitle(SEASON, formattedTitle);
		return `S-${season}-E-${episode}`;
	}

	function getSeasonAndEpisode(storageSEKey) {
		return {
			season: storageSEKey.split(HYPHEN)[1],
			episode: storageSEKey.split(HYPHEN)[3],
		};
	}

	async function currentStoredValue(seriesName) {
		const res = await chrome.storage.local.get(seriesName);
		return res[seriesName];
	}

	function isSeasonTab(url) {
		const urlToArray = url.split("/");
		return urlToArray[7] === "seasons";
	}

	function getCurrentSeasonFromUrl(url) {
		const urlToArray = url.split("/");
		return urlToArray[8].split(HYPHEN)[1];
	}

	function isHomeTab(url) {
		const urlToArray = url.split("/");
		return urlToArray.length === 7 && !isNaN(urlToArray[6]);
	}

	if (isHomeTab(currentTab.url)) {
		const currentStoredProgress = await currentStoredValue(
			getSeriesName(currentTab.url)
		);
		const { season } = getSeasonAndEpisode(currentStoredProgress.key);
		chrome.tabs.query(
			{ active: true, lastFocusedWindow: true },
			function (tabs) {
				if (tabs[0].id) {
					chrome.tabs.sendMessage(tabs[0].id, { action: "SET_SEASON", season });
				}
			}
		);
	}

	if (isSeasonTab(currentTab.url)) {
		console.log(currentTab.url);
		const currSeason = getCurrentSeasonFromUrl(currentTab.url);
		const currentStoredProgress = await currentStoredValue(
			getSeriesName(currentTab.url)
		);
		console.log(currentStoredProgress);
		const { season, episode } = getSeasonAndEpisode(currentStoredProgress.key);

		if (season === currSeason) {
			console.log("hit");
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				if (tabs[0].id) {
					chrome.tabs.sendMessage(tabs[0].id, {
						action: "SET_EPISODE",
						episode,
					});
				}
			});
		}

		console.log(currSeason, currentStoredProgress, "llb");
	}
	if (isTitleValid(currentTab.title)) {
		const currentEpisodeSeason = convertToSEKey(formatString(currentTab.title));
		const seriesName = getSeriesName(currentTab.url);
		const objectToStore = {
			[seriesName]: {
				key: currentEpisodeSeason,
				url: currentTab.url,
			},
		};
		console.log(objectToStore, "obs");
		chrome.storage.local.set(objectToStore, () => {
			console.log(`set ${seriesName} to ${currentEpisodeSeason}`);
		});
	}
}
