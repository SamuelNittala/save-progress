type RequestType = {
	action: string;
	episode: number;
	season: number;
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

		setTimeout(() => {
			((document.getElementsByClassName(
				"slick-track"
			)[1].children[request.season - 1] as HTMLDivElement).style.border = "3px solid red");
			return true;
		}, 500);

		return false;
	}
});
