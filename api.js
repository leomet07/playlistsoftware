const router = require("express").Router();
const puppet = require("./puppet");
const fetch = require("node-fetch");
var SpotifyWebApi = require("spotify-web-api-node");

var spotifyApi = new SpotifyWebApi({
	clientId: process.env.clientID,
	clientSecret: process.env.clientSecret,
	redirectUri: "http://localhost:3000/",
});

router.get("/", async (req, res) => {
	return res.json({ message: "Api" });
});

router.get("/getYTSongs/:id", async (req, res) => {
	const playlistid = req.params.id;

	const songs = await getSongs(playlistid);
	return res.json({ songs: songs });
});

router.post("/yttospotify", async (req, res) => {
	const body = req.body;

	if (Object.keys(body).length !== 0) {
		let access_token = body.access_token;

		if (!access_token) {
			return res.json({ message: "No access_token provided." });
		}

		let ytID = body.ytID;

		if (!ytID) {
			return res.json({ message: "No ytID provided." });
		}
		console.log("Access token: ", access_token);
		const back = await puppet.convert(ytID, access_token);

		return res.json({
			body: body,
			songs: back.spotifySongs,
			id: back.playlistID,
		});
	} else {
		return res.json({ message: "No body provided" });
	}
});

router.post("/getauth", async (req, res) => {
	const code = req.body.code;

	const back = await spotifyApi.authorizationCodeGrant(code);

	console.log(back);

	res.json({ access_token: back.body.access_token });
});

module.exports = { router };
