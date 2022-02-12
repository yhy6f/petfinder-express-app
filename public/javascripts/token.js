function refreshToken() {
    let access_token = '';
    const body = {
        "grant_type": "client_credentials",
        "client_id": "5UAdwt5KiGDH1yxa5zYQJ4nR7mpS9NC4I4Slhf7LcYYCG0An9l",
        "client_secret": "ClM1upnfyamGeN9pQVSNyMIedgPXwbcQGaScdT0S"
    }
    fetch('https://api.petfinder.com/v2/oauth2/token', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    })
    .then(response => response.json())
    .then(auth => {
        // console.log(typeof(auth));
        console.log(auth.access_token);
        access_token = auth.access_token;
    })
    .catch(error => console.error(error))

    return access_token;
}
    
let accessToken = refreshToken();