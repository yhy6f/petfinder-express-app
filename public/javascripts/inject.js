const myScriptTag = document.createElement('script');
myScriptTag.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&callback=initGoogle`;
myScriptTag.setAttribute("async", "");
document.body.appendChild(myScriptTag);