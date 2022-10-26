type RequestType = {
	action: string;
	episode: number;
	season: number;
	url: string;
}
function getElementByXpath(path : string) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

chrome.runtime.onMessage.addListener((request: RequestType) => {

	if (request.action === "SET_EPISODE") {
		console.log("message received to set episodes", request.episode);

		//FIND A BETTER WAY
		setTimeout(() => {
			(document.getElementsByClassName(
				"resClass"
			)[0].children[request.episode - 1] as HTMLDivElement).style.border = "3px solid red";
			return true;
		}, 500);

		return false;
	}
	if (request.action === "SET_SEASON") {
		console.log("message received to set season", request.season);
		const updateUIInterval = setInterval(() => {
			const silckTrackDiv = document.getElementsByClassName(
				"slick-track"
			)[1];

			if (silckTrackDiv) {
				(silckTrackDiv.children[request.season - 1] as HTMLDivElement).style.border = "3px solid green";

				if (request.url && request.episode) {
					const currentlyPlayingAnchor = getElementByXpath("/html/body/div[1]/div/div/div[1]/div[2]/div[1]/div/div[3]/div[2]/div/div[1]/div[1]/a");
					const currentlyPlayingBigAnchor = getElementByXpath("/html/body/div[1]/div/div/div[1]/div[2]/div[1]/div/div[3]/div[2]/a");
					const seasonEpisodeText = getElementByXpath("/html/body/div[1]/div/div/div[1]/div[2]/div[1]/div/div[3]/div[2]/div/div[1]/div[1]/a/div/div[2]/div[2]/span[1]");

					const newHref = `/${request.url.split("/").splice(3).join('/')}`;
					if (currentlyPlayingAnchor) {
						(currentlyPlayingBigAnchor as HTMLAnchorElement).setAttribute("to", newHref);
						(currentlyPlayingBigAnchor as HTMLAnchorElement).href = newHref;

						(currentlyPlayingAnchor as HTMLAnchorElement).setAttribute("to", newHref);
						(currentlyPlayingAnchor as HTMLAnchorElement).href = newHref;

						(seasonEpisodeText as HTMLSpanElement).innerHTML = `S${request.season} E${request.episode}`;
						(seasonEpisodeText as HTMLSpanElement).style.color = "yellow";

						clearInterval(updateUIInterval);
					}
				}

				clearInterval(updateUIInterval)
			}
			return true;
		}, 1000);
		return false;
	}
});
