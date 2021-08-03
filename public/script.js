window.onload = async () => {
	let currentlocation = window.location;
	console.log("Window loaded", currentlocation);
	if (currentlocation.hash) {
		const hash = currentlocation.hash.slice(1);
		console.log("We have a hash", hash);
		const args = new URLSearchParams(hash);

		let access_token = args.get("access_token");
	}
};

document
	.getElementById("loginwithspotify")
	.addEventListener("click", async () => {
		console.log("Login with spotify");

		const url =
			"https://accounts.spotify.com/authorize?client_id=3bf1f10449fb41198b83a7809159c608&redirect_uri=http://localhost:3000/&response_type=token";
		window.location.replace(url);
	});
