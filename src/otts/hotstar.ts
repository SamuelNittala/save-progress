const SPACE = " ";
const EMPTY = "";
const HYPHEN = "-";
const EPISODE = "episode";
const SEASON = "season";

const SET_SEASON = "SET_SEASON";
const SET_EPISODE = "SET_EPISODE";

export async function handleHotStarTitle(currentTab : chrome.tabs.Tab) {

	function formatString(string : string) {
		return string.replaceAll(SPACE, EMPTY).toLowerCase();
	}

	function isTitleValid(title : string) {
		const formattedTitle = formatString(title);
		return (
			formattedTitle.search(EPISODE) !== -1 &&
			formattedTitle.search("episodes") === -1 &&
			formattedTitle.search(SEASON) !== -1
		);
	}

	function getSeriesName(url : string) {
		return url.split("/")[5].replace("-", "_");
	}

	function getNumbersFromTitle(key : string, formattedTitle : string) {
		return formattedTitle
			.slice(formattedTitle.search(key) + key.length)
			.split(EMPTY)
			.reduce(
				(prev, curr) => {
					if (!prev.hitCharFlag) {
						return Number(curr)
							? { ...prev, value: `${prev.value}${curr}` }
							: { ...prev, hitCharFlag: true };
					}
					return prev;
				},
				{ hitCharFlag: false, value: "" }
			).value;
	}

	function convertToSEKey(formattedTitle : string) {
		const episode = getNumbersFromTitle(EPISODE, formattedTitle);
		const season = getNumbersFromTitle(SEASON, formattedTitle);
		return `S-${season}-E-${episode}`;
	}

	function getSeasonAndEpisode(storageSEKey : string) {
		return {
			season: storageSEKey.split(HYPHEN)[1],
			episode: storageSEKey.split(HYPHEN)[3],
		};
	}

	async function currentStoredValue(seriesName : string) {
		const res = await chrome.storage.local.get(seriesName);
		return res[seriesName];
	}

	function isSeasonTab(url : string) {
		const urlToArray = url.split("/");
		return urlToArray[7] === "seasons";
	}

	function getCurrentSeasonFromUrl(url : string) {
		const urlToArray = url.split("/");
		return urlToArray[8].split(HYPHEN)[1];
	}

	function isHomeTab(url : string) {
		const urlToArray = url.split("/");
		return urlToArray.length === 7 && Number(urlToArray[6]);
	}

	if (currentTab.url && currentTab.title) {
		if (isHomeTab(currentTab.url)) {
			const currentStoredProgress = await currentStoredValue(
				getSeriesName(currentTab.url)
			);
			const { season } = getSeasonAndEpisode(currentStoredProgress.key);
			chrome.tabs.query(
				{ active: true, lastFocusedWindow: true },
				function (tabs) {
					if (tabs[0].id) {
						chrome.tabs.sendMessage(tabs[0].id, { action: SET_SEASON, season });
					}
				}
			);
		}

		if (isSeasonTab(currentTab.url)) {
			const currSeason = getCurrentSeasonFromUrl(currentTab.url);
			const currentStoredProgress = await currentStoredValue(
				getSeriesName(currentTab.url)
			);
			const { season, episode } = getSeasonAndEpisode(currentStoredProgress.key);

			if (season === currSeason) {
				chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
					if (tabs[0].id) {
						chrome.tabs.sendMessage(tabs[0].id, {
							action: SET_EPISODE,
							episode,
						});
					}
				});
			}
		}

		if (isTitleValid(currentTab.title)) {
			const currentEpisodeSeason = convertToSEKey(formatString(currentTab.title || ''));
			const seriesName = getSeriesName(currentTab.url);
			const objectToStore = {
				[seriesName]: {
					key: currentEpisodeSeason,
					url: currentTab.url,
				},
			};
			chrome.storage.local.set(objectToStore, () => {
				console.log(`set ${seriesName} to ${currentEpisodeSeason}`);
			});
		}
	}
}
