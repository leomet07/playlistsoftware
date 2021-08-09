require("dotenv").config();
const fetch = require("node-fetch");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const getPlaylist = require("./getPlaylist");
const cliProgress = require("cli-progress");

function extractItems() {
	const extractedElements = document.querySelectorAll(
		"#contents > .ytmusic-playlist-shelf-renderer"
	);
	const items = [];
	for (let element of extractedElements) {
		items.push(element.outerHTML);
	}
	return items;
}

async function scrapeInfiniteScrollItems(page, extractItems, itemTargetCount) {
	let items = [];
	try {
		let previousHeight;
		while (items.length < itemTargetCount) {
			items = await page.evaluate(extractItems);

			previousHeight = await page.evaluate("document.body.scrollHeight");

			await page.evaluate(
				"window.scrollTo(0, document.body.scrollHeight)",
				{ timeout: 1000 }
			);

			await page.waitForSelector(".spinner-container", {
				hidden: true,
				timeout: 1000,
			});
		}
	} catch (e) {
		console.log("Error: ", e);
	}
	return items;
}

async function getSongs(playlistID) {
	const browser = await puppeteer.launch({
		headless: true,
		args: [
			"--no-sandbox",
			"--disable-setuid-sandbox",
			"--disable-blink-features=AutomationControlled",
			"--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
		],
	});
	const page = await browser.newPage();
	page.setViewport({ width: 1280, height: 926 });

	let playlist = await getPlaylist(playlistID);
	console.log("Songs expected: ", playlist.trackCount);
	await page.goto("https://music.youtube.com/playlist?list=" + playlistID);

	const items = await scrapeInfiniteScrollItems(
		page,
		extractItems,
		playlist.trackCount
	);

	await browser.close();

	console.log("Songs scraped: ", items.length);

	let songs = [];

	for (let item of items) {
		try {
			const $ = cheerio.load(item);

			const name = $(".title").text();

			let html = $(".ytmusic-playlist-shelf-renderer").parent().html();
			html = html.slice(0, 180);

			if (html.includes('unplayable_=""')) {
				console.log("unplayable song:", name);
			} else {
				// console.log("valid song:", name);
				songs.push(name);
			}
		} catch (e) {
			console.log("Error parsing", e);
		}
	}

	return songs;
}

async function searchSong(songName, auth_token) {
	let noCred = songName.replace(/ *\([^)]*\) */g, "");

	const url =
		"https://api.spotify.com/v1/search?q=" +
		encodeURI(noCred) +
		"&type=track";
	let request = await fetch(url, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: "Bearer " + auth_token,
		},
	});

	let rjson = await request.json();

	if (rjson.error) {
		console.log("\nErorr", rjson.error.status, rjson.error.message);
		return null;
	}

	if (rjson.tracks.items.length > 0) {
		// console.log(rjson.tracks.items[0].name);
		return rjson.tracks.items[0];
	} else {
		console.log("\nNone spotify alternatives found: ", songName, noCred);

		return null;
	}
}

async function getSpotifySongs(songs, auth_token) {
	console.log("Converting...");
	let spotifySongs = [];

	const bar = new cliProgress.SingleBar({}, cliProgress.Presets.legacy);

	bar.start(songs.length, 0);

	for (let i = 0; i < songs.length; i++) {
		let songName = songs[i];
		const spotifySong = await searchSong(songName, auth_token);
		if (spotifySong) {
			spotifySongs.push(spotifySong);
		}

		bar.update(i);
	}

	bar.update(songs.length);

	bar.stop();

	return spotifySongs;
}

async function main() {
	let songs = await getSongs(process.env.playlistID);
	// console.log("Songs: ", songs);

	let spotifySongs = await getSpotifySongs(songs, process.env.auth_token);

	console.log("Spotify length: ", spotifySongs.length);
}
// like python's if __name__ == "__main__":
if (require.main === module) {
	main();
}

module.exports = { getSongs };
