chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "SET_EPISODE") {
		console.log("message received to set episodes", request.episode);

		//FIND A BETTER WAY
		setTimeout(() => {
			const currentEpisode = (document.getElementsByClassName(
				"resClass"
			)[0].children[request.episode - 1].style.border = "3px solid red");
			console.log(currentEpisode);
		}, 500);
	}
	if (request.action === "SET_SEASON") {
		console.log("message received to set season", request.season);
		setTimeout(() => {
			const currentSeason = (document.getElementsByClassName(
				"slick-track"
			)[1].children[request.season - 1].style.border = "3px solid red");
			console.log(currentSeason);
		}, 500);
	}
});
