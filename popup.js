function getSeriesNameHotstar(title) {
	const startKey = "Watch",
		endKey = "Season";
	const seriesName = title.split(" ").reduce(
		(prev, curr) => {
			if (curr === startKey) {
				return { ...prev, flag: true };
			}
			if (curr === endKey) {
				return { ...prev, flag: false };
			}
			if (prev.flag) {
				return { ...prev, value: (prev.value += `${curr}`) };
			}
			return prev;
		},
		{ flag: false, value: "" }
	);
	return seriesName.value;
}

let currentUrl = null;
window.addEventListener("DOMContentLoaded", () => {
	// ...query for the active tab...
	chrome.tabs.query(
		{
			active: true,
			currentWindow: true,
		},
		(tabs) => {
			const seriesName = getSeriesNameHotstar(tabs[0].title);
			chrome.storage.local.get(seriesName).then((res) => {
				currentUrl = res[seriesName].url;
			});
		}
	);
});

window.addEventListener("click", (e) => {
	if (e.target.id === "past-episode") {
		chrome.tabs.query(
			{
				active: true,
				currentWindow: true,
			},
			(tabs) => {
				const seriesName = getSeriesNameHotstar(tabs[0].title);
				chrome.storage.local.get(seriesName).then((res) => {
					currentUrl = res[seriesName].url;
				});
				chrome.tabs.update(currentUrl);
			}
		);
	}
});
