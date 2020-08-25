// "api.openweathermap.org/data/2.5/forecast?q=London,us&mode=xml"
// http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID={YOUR API KEY}
const apiKey = "e50c991dffb6aa38fe794e7859d8d281";
let cityNameInput = $("#input");

// this is the api url with my api key plugged in
function forecastURL(cityName) {
    return `http://api.openweathermap.org/data/2.5/forecast?q=${cityName},us&APPID=${apiKey}`
}

// function to change temp from kelvin to fahrenheit
function inFahrenheit(kelvin) {
    return (kelvin - 273.15) * 1.80 + 32;
}

// api call on click of the search button which returns the information from the api library
$("#srchBtn").click(function() {
    let forecast = forecastURL(cityNameInput.val());
    $.ajax(forecast).then(function(response) {
        console.log(response)
        let lattitude = response.city.coord.lat;
        let longitude = response.city.coord.lon;
        $("#cityName").text(response.city.name);
        $("#temperature").text("Temperature: " + inFahrenheit(response.list[0].main.temp));
        $("#humidity").text("Humidity: " + response.list[0].main.humidity + "%");
        $("#windSpeed").text("Wind Speed: " + response.list[0].wind.speed + "MPH");

        // second call gathing the information for the UV index and putting it on the page
        uvIndexUrl();
        console.log(uvIndexUrl());
        $.ajax(uvIndexUrl()).then(function(info) {
            console.log(info);
            $("#uvIndex").text("UV Index: " + info.current.uvi)
        }) 

        // second api call to use lon and lat
        function uvIndexUrl() {
            return `https://api.openweathermap.org/data/2.5/onecall?lat=${lattitude}&lon=${longitude}&exclude=minutely,hourly&appid=${apiKey}`
        }



    });
});