const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI1VUFkd3Q1S2lHREgxeXhhNXpZUUo0blI3bXBTOU5DNEk0U2xoZjdMY1lZQ0cwQW45bCIsImp0aSI6IjY1ZmM0ZTU3NmM1MjExYzAyOTk0NTU0NDAyM2I2MDJiYzVjZDg0ZTIxNDhkYjY5ZTk0YjUzNzAxMTdlMjg0MTg3MTkxZGI4ZmYyNzU5YTBlIiwiaWF0IjoxNjQ0MzUxMjkxLCJuYmYiOjE2NDQzNTEyOTEsImV4cCI6MTY0NDM1NDg5MSwic3ViIjoiIiwic2NvcGVzIjpbXX0.SRTnYhO1ricaJ7VRfnZ1yzlCd56oab4h2Rih4skim58G2ltrmxROiKieihyVuSvAnQwcTjdftWUPo6RI0FzfrxZTLwr3l6aEz7ZYTeC2jtmdq5WJxNpERng0kFVwcOzm38kjSdCGwkNxUTUguHzZUvxZFoPindpznXxO1k5DSeVC4GeDCS5iO4oV9bf93gxdlIISE_o4wqdswc1kqVhp6qn0EPi1v_2GOB3-nLkERSAj26Rg_110VUGQOCjikEDjEazdqeZraVlTLJG_Aypw8VcFPo15FBGZLGcywcij5pQABaHZiDs0wGroL0EBnSShjn8zl57jCVfyXSqrCdEqrg";
const distanceInputButton = document.querySelector("#submitDistance");
const distanceInput = document.querySelector("input.input");

// console.log(process.env.GOOGLE_API_KEY)

distanceInputButton.addEventListener("click", function() {
    
    if(navigator.geolocation) {

        navigator.geolocation.getCurrentPosition((loc) => {
            // console.log(loc);
            location.lat = loc.coords.latitude;
            location.lng = loc.coords.longitude;
            let distance = distanceInput.value;
            let shelterEndpoint = `https://api.petfinder.com/v2/organizations?location=${location.lat},${location.lng}&distance=${distance}`;

            console.log(shelterEndpoint);

            infoWindow = new google.maps.InfoWindow({
                maxWidth: 200
            });

            fetch(shelterEndpoint, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then(resp => resp.json())
                .then(data => {
                    console.log(data);
                    const first10 = data.organizations.slice(0,10);
                    first10.forEach(function (org) {

                        geocoder.geocode( {'address':org.address.postcode}, 
                        
                        function(results, status) {
                            if (status == 'OK') {
                                // console.log(results[0].geometry.location)
                                map.setCenter(results[0].geometry.location);
                                var marker = new google.maps.Marker({
                                    map: map,
                                    position: results[0].geometry.location,
                                    optimized: false,
                                    // if true it's static
                                    animation: google.maps.Animation.DROP 
                                    // adds the animation effects when pins are dropped
                                });

                                google.maps.event.addListener(marker, 'click', (function(marker) {

                                    return function() {
                                        let contentString = createContentString(org.name,org.photos,org.phone,org.website);

                                        infoWindow.setContent(contentString)

                                        infoWindow.open({
                                            map: map,
                                            anchor: marker,
                                            shouldFocus: true
                                        });
                                    }
                              
                                  })(marker));

                            } else {
                              alert('Geocode was not successful for the following reason: ' + status);
                            }
                          });
                    });
                })
                .catch(err => console.log(err))
            })
    } else {
            console.log('geolocation is not supported :(');
    }
})

function initGoogle() {
    var location = {
        lat: 40.000,
        lng: -79.000
    }
    var options = {
        center: location,
        zoom: 9
    }
    // If user allows browser to track location, get user location via navigator.geolocation.getCurrentPosition()
    if(navigator.geolocation) {
        console.log('geolocation is here!');
        navigator.geolocation.getCurrentPosition((loc) => {
            location.lat = loc.coords.latitude;
            location.lng = loc.coords.longitude
            map = new google.maps.Map(document.getElementById("map"), options);
            geocoder = new google.maps.Geocoder();
        },
        (err) => {
            console.log("User clicked no lol");
            map = new google.maps.Map(document.getElementById("map"), options);
        }
        )

    } else {
        console.log('geolocation is not supported :(');
        map = new google.maps.Map(document.getElementById("map"), options);
    }
}

function createContentString(name, photos, phone, website) {

    contentString = (photos.length===0) ? `<h3>${name}</h3>
    <p>Phone: ${phone}</p>
    <p>Website: ${website}</p>`:`
    <h3>${name}</h3>
    <img src=${photos[0].small}>
    <p>Phone: ${phone}</p>
    <p>Website: ${website}</p>`;

    return(contentString)
}


// next steps: 

// DONE 1: some of the return organizations their org.photos is Array(0). And the infoWindow won't render returning an error
// Uncaught TypeError: Cannot read properties of undefined (reading 'small')

// 2: page loads very slow; refactor into modules

// 3: find a place to deploy (github pages probably won't work because of the api keys)

// 4: change marker event handler to open up a popup that displays pictures of available cats; use pet finder api animal search using shelter id

// 5: add save animal function next to each cat picture; add login and allow users to see saved animals; firebase realtime database,  

// 6: what if user clicked no when asking if allowing to use their locations?





