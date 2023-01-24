let options, spans;

$(document).ready(init)

// On document ready let's send a request for location.
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

// If we get a location, let's package up the coordinates and send it to the openWeather API
function gotPos(position) {
    let lat = parseFloat(position.coords.latitude.toFixed(2))
    let lon = parseFloat(position.coords.longitude.toFixed(2))
    openWeatherAPI({city: 'Your Location', lat: lat, lon: lon});
}

// Print the error the the main-header.
function posFail(err) {
    $('#current-location').text(err.message)
}

// Main search button.
$('#location-button').click( () => {
    let query = $('#location-input').val();
    if (query === '') {
        return
    } else {
        $("#tableBody").empty();
        $("#seven-day-forecast").empty();
        $('.modal').toggleClass('is-active');
        geoLocationAPI(query);
    }
})

// Click out of a modal so user doesn't get stuck.
$('.modal-background').click( () => {
    $('.modal').toggleClass('is-active')
})

// geolocationAPI. Put in name, return a list of cities that match the query + their coordinates.
let geoLocationAPI = (query) => {
    console.log(query)
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

// After we decide which coordinates to use, we'll send them through this function to return our weather
let openWeatherAPI = ({city, lat, lon}) => {
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
        let currentWeather = {city: city, date: data.current.dt, temp: data.current.temp, wind: data.current.wind_speed, humidity: data.current.humidity, icon: data.current.weather[0].icon};
        pushSevenDayForecast(data.daily)
        pushCurrentForecast(currentWeather)
    })
}

// Build a table with every possible location based on searched city name. Let the user decide which they want.
let buildLocationTable = location => {
    let coordinates = {city: location.name, lat: location.lat.toFixed(2) , lon: location.lon.toFixed(2)};
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
            addSearchHistory($(this).data());
            openWeatherAPI($(this).data());
        })
    $('#tableBody').append(tableRow.append(locationTableCity, locationTableState, locationTableCountry, locationTableButton));
}

// Return the weather info and build up cards for each day displaying the rough weather conditions.
let buildWeatherCard = value => {
    let time = dayjs.unix(value.dt).format('MMMM D');
    let icon = value.weather[0].icon;
    let weatherCard = `
        <div class="card has-background-info">
            <div class="card-content p-2 is-flex is-flex-direction-column is-justify-content-space-evenly">
                <p class="has-text-weight-bold is-size-5">${time}</p>
                <img id="weather-card-icon" src="http://openweathermap.org/img/wn/${icon}@2x.png">
                <p><span class="has-text-weight-bold">Temp:</span> ${value.temp.day}&#176;C</p>
                <p><span class="has-text-weight-bold">Wind:</span> ${value.wind_speed}m/s</p>
                <p><span class="has-text-weight-bold">Humidity:</span> ${value.humidity}%</p>
            </div>
        </div>
        `;
    $('#seven-day-forecast').append(weatherCard);
}

// Build our history of searches via buttons.
let buildHistoryButton = value => {
    let coordinates = {city: value.city, lat: value.lat , lon: value.lon};
    let historyButton = $('<button>'+value. city+'</button>')
    $(historyButton)
        .data(coordinates)
        .addClass('button history-button is-small is-fullwidth is-size-6')
        .click( function() {
            $('#seven-day-forecast').empty();
            openWeatherAPI(coordinates)
        })
    $('#history-buttons').append(historyButton)
}

// Push the current forecast to the top section of the website and display relevent information.
let pushCurrentForecast = data => {
    let icon = data.icon
    $('#current-date').text(dayjs.unix(data.date).format('MMMM D'))
    $('#current-location').text(data.city);
    $('#current-temperature').text(data.temp);
    $('#current-wind').text(data.wind);
    $('#current-humidity').text(data.humidity);
    $('#current-icon').attr('src', 'http://openweathermap.org/img/wn/'+icon+'@2x.png')
}

// Push the weekly weather information to our function that builds weather cards.
let pushSevenDayForecast = data => {
    data.pop()
    $.each(data, (index, value) => {
        buildWeatherCard(value)
    })
}

// Handle local storage. Keep a maximum of five entries.
let addSearchHistory = (coordinates) => {
    let searchHistory = localStorage.getItem('searchHistory');
    if (searchHistory) {
        searchHistory = JSON.parse(searchHistory);
    } else {
        searchHistory = [];
    }
    let isExist = searchHistory.some(function(history) {
        return history.city === coordinates.city;
    });

    if (isExist) {
        console.log('Already exists in search history.')
    } else {  
        searchHistory.unshift(coordinates);
        if(searchHistory.length > 5) {
            searchHistory.pop();
        }
        let updatedSearchHistory = JSON.stringify(searchHistory);
        localStorage.setItem('searchHistory', updatedSearchHistory);
    }
    updateSearchHistory()
}

// Keep our search history up-to-date.
let updateSearchHistory = () => {
    let searchHistory = localStorage.getItem('searchHistory');
    if (searchHistory) {
        searchHistory = JSON.parse(searchHistory)
    }
    $('#history-buttons').empty()
    $.each(searchHistory, (index, value) => {
        buildHistoryButton(value)
    })
}

updateSearchHistory()