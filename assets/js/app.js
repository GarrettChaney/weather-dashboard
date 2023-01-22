$('.modal-background').click( () => {
    $('.modal').toggleClass('is-active')
})

$('#location-button').click( () => {
    let query = $('#location-input').val();
    let apiKey = 'cf4c28c944be675eda76e953b6fa73c2';
    let url =`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`;
    // failsafe empty input
    if (query === "") {
        return
    }
    // clear the table, operate modal
    $("#tableBody").children().empty();
    $('.modal').toggleClass('is-active');
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
    let coordinates = {lat: location.lat.toFixed(2) , lon: location.lon.toFixed(2), city: location.name};
    // build the output
    let tableRow = $('<tr></tr>');
    let locationTableCity = $('<td></td>').text(location.name);
    let locationTableState = $('<td></td>').text(location.state);
    let locationTableCountry = $('<td></td>').text(location.country);
    let locationTableButton = $('<button>Select</button>').data(coordinates);
    // button styling+handling
    $(locationTableButton).addClass('button is-info is-small is-fullwidth');
    // $(locationTableButton).data(coordinates);
    $(locationTableButton).click( function() {
       openWeatherAPI($(this).data());
       $('.modal').toggleClass('is-active');
    })
    // append the output
    $('#tableBody').append(tableRow.append(locationTableCity, locationTableState, locationTableCountry, locationTableButton));
}

let openWeatherAPI = ({lat, lon, city}) => {
    let units = 'metric';
    let exclude = 'minutely,hourly,alerts';
    let apiKey = 'cf4c28c944be675eda76e953b6fa73c2';
    let url =`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=${units}&exclude=${exclude}&appid=${apiKey}`;
    // ajax call for 5-day forecast
    $.ajax({
        url: url,
        method: 'GET',
    })
    .then( (data) => {
        console.log(data) 
        let currentWeather = {city: city, date: data.current.dt, temp: data.current.temp, wind: data.current.wind_speed, humidity:data.current.humidity};
        pushCurrentForecast(currentWeather)
        pushSevenDayForecast(data.daily)
    })
}

let pushCurrentForecast = data => {
    $('#current-date').text(dayjs.unix(data.date).format('DD/MM/YYYY'))
    $('#current-location').text(data.city);
    $('#current-temperature').text(data.temp);
    $('#current-wind').text(data.wind);
    $('#current-humidity').text(data.humidity);
}

let pushSevenDayForecast = data => {
    data.pop()
    $.each(data, (index, value) => {
        let time = dayjs.unix(value.dt).format('DD/MM/YYYY');
        let weatherCard = $('<div></div>').addClass('card has-background-info')
        let weatherCardContent = $('<div></div>').addClass('card-content p-2 is-flex is-flex-direction-column is-justify-content-space-evenly')
        let dateP = $('<p>'+ time + '</p>').addClass('has-text-weight-bold is-size-5')
        let tempP = $('<p>Temp: ' + value.temp.day + '&#176;C</p>') 
        let windP = $('<p>Wind: ' + value.wind_speed + 'm/s</p>') 
        let humidityP = $('<p>Humidity: ' + value.humidity + '%</p>') 

        $('#seven-day-forecast').append(weatherCard.append(weatherCardContent.append(dateP, tempP, windP, humidityP)))
    })
}

// $('#pakenham-button').click( () => {
//     let time = dayjs.unix(1674957600).format()
//     console.log(time)
// })

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