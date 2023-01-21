$('#location-button').click( () => {
    $('.modal').toggleClass('is-active')
})

$('.modal-background').click( () => {
    $('.modal').toggleClass('is-active')
})

$('#location-button').click( () => {
    let query = $('#location-input').val();
    let apiKey = 'cf4c28c944be675eda76e953b6fa73c2';
    let url =`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`;
    // clear the table
    $("#tableBody").children().empty();
    // ajax call
    $.ajax({
        url: url,
        method: 'GET',
    })
    .then( (response) => {
        $.each(response, (index, value) => {
            genLoc(value);
        })
    })
})

let genLoc = location => {
    // grab coordinates
    let coordinates = {Latitude: location.lat.toFixed(2) , Longitude: location.lon.toFixed(2)};
    // build the output
    let tableRow = $('<tr></tr>');
    let locationTableCity = $('<td></td>').text(location.name);
    let locationTableState = $('<td></td>').text(location.state);
    let locationTableCountry = $('<td></td>').text(location.country);
    let locationTableButton = $('<button>Select</button>');
    // button styling+handling
    $(locationTableButton).addClass('button is-info is-small is-fullwidth');
    $(locationTableButton).data(coordinates);
    $(locationTableButton).click( function() {
       getForecast($(this).data());
    })
    // append the output
    $('#tableBody').append(tableRow.append(locationTableCity, locationTableState, locationTableCountry, locationTableButton));
}

let getForecast = (coordinates) => {
    console.log(coordinates)
}

// let G, options, spans;

// $(document).ready(init)

// function init() {
//     if (navigator.geolocation) {
//         let giveUp = 1000 * 30;
//         let tooOld = 1000 * 60 * 60;
//         options = {
//             enableHighAccuracy: false,
//             timeout: giveUp,
//             maximumAge: tooOld
//         }
    
//     navigator.geolocation.getCurrentPosition(gotPos, posFail, options);
//     } else {

//     }
// } 

// function gotPos(position) {
//     console.log(position.coords.latitude)
//     console.log(position.coords.longitude)
// }

// function posFail(err) {
//     $('#main-header').text(err.message)
// }