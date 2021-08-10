const router = require("express").Router();
const puppet = require("./puppet");
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
		const songs = await puppet.convert(ytID, access_token);

		return res.json({ body, songs });
	} else {
		return res.json({ message: "No body provided" });
	}
});

module.exports = { router };
