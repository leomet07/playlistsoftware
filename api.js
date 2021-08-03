const router = require("express").Router();
const getSongs = require("./puppet").getSongs;
router.get("/", async (req, res) => {
	return res.json({ message: "Api" });
});

router.get("/getYTSongs/:id", async (req, res) => {
	const playlistid = req.params.id;

	const songs = await getSongs(playlistid);
	return res.json({ songs: songs });
});

module.exports = { router };
