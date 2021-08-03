const express = require("express");
const app = express();

app.get("/api", (req, res) => {
	res.send("Playlist converter api");
});

app.use(express.static("public"));

const PORT = 6942 || process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server listening on port: ${PORT}`);
});
