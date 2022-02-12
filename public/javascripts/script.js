const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI1VUFkd3Q1S2lHREgxeXhhNXpZUUo0blI3bXBTOU5DNEk0U2xoZjdMY1lZQ0cwQW45bCIsImp0aSI6IjlmOTU1MDBlMWQxNjRkMGVmNTQxMDExZDZkZmU4NjhmNjc1NGQ1NjhkNzU1ZTMzMmE3NzUyZmE3YzViMTM4MjVhNTE3MTcyOTI5OWRmNjc4IiwiaWF0IjoxNjQ0Njc2MDQyLCJuYmYiOjE2NDQ2NzYwNDIsImV4cCI6MTY0NDY3OTY0Miwic3ViIjoiIiwic2NvcGVzIjpbXX0.Pxi7hRGijWQ0eUvgBFKRUzKRJ9sUU3wr2Se5VBPOArLjT6XOhmkJuQ1K2DzicaePgGOju6es9CZvXfKqZjiXQcDTFxwGFdeHHq21ZSzRo7KF177HaThmxqpl0HouH875N-nZiwnumuLU4C399wabDlZgpElavSvfbfQ-XnzjuokaLXeBnJkkACUjjy1P6yUTb5AZkitJFpvYv9ImuiqG5Z-RgCm9HALHRGOJkY3vCPy0fyAcd7SrMoE7uPS3fXe6grOwANxS7CL8giQ5r5elbmuPeZcgPIsXKNQ618gMgck8ivmR1Atz8Y2wqJDQPOvc_BGyfEzHd9VxTZegFqlaLQ";
const distanceInputButton = document.querySelector("#submitDistance");
const distanceInput = document.querySelector("input.input");

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




