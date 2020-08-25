// "api.openweathermap.org/data/2.5/forecast?q=London,us&mode=xml"
// http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID={YOUR API KEY}
const apiKey = "e50c991dffb6aa38fe794e7859d8d281";
let city = "Salt Lake";
let cityNameInput = $("#input");


function forecastURL(cityName) {
    return `http://api.openweathermap.org/data/2.5/forecast?q=${cityName},us&APPID=${apiKey}`
}

function inFahrenheit(kelvin) {
    return (kelvin - 273.15) * 1.80 + 32;
}

$("#srchBtn").click(function() {
    let forecast = forecastURL(cityNameInput.val());
    $.ajax(forecast).then(function(response) {
        console.log(response)
        $("#cityName").text(response.city.name);
        $("#temperature").text("Temperature: " + inFahrenheit(response.list[0].main.temp));
        $("#humidity").text("Humidity: " + response.list[0].main.humidity + "%");
        $("#windSpeed").text("Wind Speed: " + response.list[0].wind.speed + "MPH")
    });
});