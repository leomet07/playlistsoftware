const router = require("express").Router();

router.get("/", async (req, res) => {
	return res.json({ message: "Api" });
});

module.exports = { router };
