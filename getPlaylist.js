const YoutubeMusicApi = require("youtube-music-api");

async function getPlaylist(playlistID) {
	const api = new YoutubeMusicApi();
	let info = await api.initalize();

	let playlist = await api.getPlaylist(playlistID);

	return playlist;
}
module.exports = getPlaylist;
