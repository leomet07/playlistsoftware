require("dotenv").config();
const express = require("express");
const app = express();
const apiRouter = require("./api").router;
app.use("/api", apiRouter);

app.use(express.static("public"));

const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server listening on port: ${PORT}`);
});
