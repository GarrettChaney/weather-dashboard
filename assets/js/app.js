let G, options, spans;

$(document).ready(init)

function init() {
    if (navigator.geolocation) {
        let giveUp = 1000 * 30;
        let tooOld = 1000 * 60 * 60;
        options = {
            enableHighAccuracy: false,
            timeout: giveUp,
            maximumAge: tooOld
        }
    
    navigator.geolocation.getCurrentPosition(gotPos, posFail, options);
    } else {

    }
} 

function gotPos(position) {
    spans = $('p span');
    $(spans[0]).text(position.coords.latitude)
    $(spans[1]).text(position.coords.longitude);
    $(spans[2]).text(position.timestamp);
}

function posFail(err) {
    $('#main-header').text(err.message)
}