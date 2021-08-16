window.onload = async () => {
	let currentlocation = window.location;
	console.log("Window loaded", currentlocation);
	const ytID = localStorage.getItem("ytID");
	const outputsongs = document.getElementById("outputsongs");

	document.getElementById("ytID").value = ytID;

	if (currentlocation.search) {
		const unparsed = currentlocation.search;
		console.log("unparsed: ", unparsed);
		const args = new URLSearchParams(unparsed);

		const code = args.get("code");
		console.log(args);
		console.log("code", code);

		if (!ytID) {
			console.log("re direct");
			window.location.replace("http://localhost:3000");
		}
		if (code) {
			const request = await fetch("http://localhost:3000/api/getauth", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ code }),
			});

			const authjson = await request.json();

			console.log("auth json", authjson);

			const access_token = authjson.access_token;

			if (ytID) {
				let response = await fetch(
					"http://localhost:3000/api/yttospotify",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							access_token: access_token,
							ytID: ytID,
						}),
					}
				);

				let rjson = await response.json();

				console.log(rjson);

				localStorage.clear();
				document.getElementById("ytID").value = "";

				let songs = rjson.songs;

				outputsongs.innerHTML = `<h3 class="subtitle">Your songs: </h3>`;
				for (let i = 0; i < songs.length; i++) {
					const song = songs[i];

					console.log(song.name);

					outputsongs.innerHTML += `<p>${song.name}</p>`;
				}
			} else {
				console.log("No yt id provided");
			}
		}
	}
};

document
	.getElementById("loginwithspotify")
	.addEventListener("submit", async (e) => {
		e.preventDefault();
		console.log("Login with spotify");

		const ytID = document.getElementById("ytID").value;
		localStorage.setItem("ytID", ytID);
		console.log("ytID", ytID);

		// const url =
		// 	"https://accounts.spotify.com/authorize?client_id=3bf1f10449fb41198b83a7809159c608&redirect_uri=http://localhost:3000/&scope=playlist-modify-public%20playlist-modify-private%20user-read-private&response_type=token";
		const url =
			"https://accounts.spotify.com/authorize?client_id=3bf1f10449fb41198b83a7809159c608&response_type=code&redirect_uri=http://localhost:3000/&scope=playlist-modify-public%20playlist-modify-private%20user-read-private&state=34fFs29kd09";
		window.location.replace(url);
	});
