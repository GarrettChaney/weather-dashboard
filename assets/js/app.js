$('#location-button').click( () => {
    $("#tableBody").empty();
    $("#seven-day-forecast").empty();
    $('.modal').toggleClass('is-active');
    let input = $('#location-input').val();
    geoLocationAPI(input);
})

$('.modal-background').click( () => {
    $('.modal').toggleClass('is-active')
})

let geoLocationAPI = (query) => {
    if (query === "") {
        return
    }
    let apiKey = 'cf4c28c944be675eda76e953b6fa73c2';
    let url =`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`;
    $.ajax({
        url: url,
        method: 'GET',
    })
    .then( (response) => {
        $.each(response, (index, value) => {
            buildLocationTable(value);
        })
    })
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
        let currentWeather = {city: city, date: data.current.dt, temp: data.current.temp, wind: data.current.wind_speed, humidity:data.current.humidity};
        pushSevenDayForecast(data.daily)
        pushCurrentForecast(currentWeather)
    })
}

let buildWeatherCard = value => {
    let time = dayjs.unix(value.dt).format('DD/MM/YYYY');
    let weatherCard = `
        <div class="card has-background-info">
            <div class="card-content p-2 is-flex is-flex-direction-column is-justify-content-space-evenly">
                <p class="has-text-weight-bold is-size-5">${time}</p>
                <p><span class="has-text-weight-bold">Temp:</span> ${value.temp.day}&#176;C</p>
                <p><span class="has-text-weight-bold">Wind:</span> ${value.wind_speed}m/s</p>
                <p><span class="has-text-weight-bold">Humidity:</span> ${value.humidity}%</p>
            </div>
        </div>
        `;
    $('#seven-day-forecast').append(weatherCard);
}

let buildLocationTable = location => {
    let coordinates = {lat: location.lat.toFixed(2) , lon: location.lon.toFixed(2), city: location.name};
    let tableRow = $('<tr></tr>');
    let locationTableCity = $('<td></td>').text(location.name);
    let locationTableState = $('<td></td>').text(location.state);
    let locationTableCountry = $('<td></td>').text(location.country);
    let locationTableButton = $('<button>Select</button>')
    $(locationTableButton)
        .data(coordinates)
        .addClass('button is-info is-small is-fullwidth')
        .click( function() {
            $('.modal').toggleClass('is-active');
            openWeatherAPI($(this).data());
        })
    $('#tableBody').append(tableRow.append(locationTableCity, locationTableState, locationTableCountry, locationTableButton));
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
        buildWeatherCard(value)
    })
}

let callLocalStorage = () => {
    
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