window.onload = async () => {
	let currentlocation = window.location;
	console.log("Window loaded", currentlocation);
	const ytID = localStorage.getItem("ytID");

	document.getElementById("ytID").value = ytID;

	if (currentlocation.hash) {
		const hash = currentlocation.hash.slice(1);

		const args = new URLSearchParams(hash);

		let access_token = args.get("access_token");
		console.log("We have an access token: ", access_token);

		let response = await fetch("http://localhost:3000/api/yttospotify", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				access_token: access_token,
				ytID: ytID,
			}),
		});

		let rjson = await response.json();

		console.log(rjson);

		localStorage.clear();
		document.getElementById("ytID").value = "";
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

		const url =
			"https://accounts.spotify.com/authorize?client_id=3bf1f10449fb41198b83a7809159c608&redirect_uri=http://localhost:3000/&scope=playlist-modify-public%20playlist-modify-private%20user-read-private&response_type=token";
		window.location.replace(url);
	});
