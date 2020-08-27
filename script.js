const apiKey = "e50c991dffb6aa38fe794e7859d8d281";
let cityNameInput = $("#input");

// this is the api url with my api key plugged in
function forecastURL(cityName) {
    return `https://api.openweathermap.org/data/2.5/forecast?q=${cityName},us&APPID=${apiKey}`
}

// function to change temp from kelvin to fahrenheit
function inFahrenheit(kelvin) {
    return ((kelvin - 273.15) * 1.80 + 32).toFixed(2);
}

const searchedCity = new Set();

// api call on click of the search button which returns the information from the api library
$("#srchBtn").click(function () {
    let forecast = forecastURL(cityNameInput.val());
    $.ajax(forecast).then(function (response) {
        searchedCity.add(cityNameInput.val());
        $(".srchd").text("");
        searchedCity.forEach(function (aCity) {
            let liEl = $(`<li>${aCity}</li>`);
            $(".srchd").append(liEl);
        });
        let lattitude = response.city.coord.lat;
        let longitude = response.city.coord.lon;
        $("#cityName").text(response.city.name);
        $("#temperature").text("Temperature: " + inFahrenheit(response.list[0].main.temp));
        $("#humidity").text("Humidity: " + response.list[0].main.humidity + "%");
        $("#windSpeed").text("Wind Speed: " + response.list[0].wind.speed + "MPH");

        // second call gathing the information for the UV index and putting it on the page as well as gathering the Forecast information
        $.ajax(uvIndexUrl()).then(function (info) {
            $("#uvIndex").text("UV Index: " + info.current.uvi);
            dateConversion(info);
        });

        // second api call to use lon and lat
        function uvIndexUrl() {
            return `https://api.openweathermap.org/data/2.5/onecall?lat=${lattitude}&lon=${longitude}&exclude=minutely,hourly&appid=${apiKey}`
        }

        // Creating a function that will take the info from this specific page and convert the Unix Time to an understandable date.
        let index = 1;
        function dateConversion(infoData) {
            $(".forecastCard").each(function() {
                let dateTime = infoData.daily[index].dt;
                const milliseconds = dateTime * 1000;
                const dateObject = new Date(milliseconds);
                let month = dateObject.toLocaleString("en-US", { month: "numeric" });
                let day = dateObject.toLocaleString("en-US", { day: "numeric" });
                let year = dateObject.toLocaleString("en-US", { year: "numeric" });
                $(this).find(".date").text(month + "/" + day + "/" + year);
                $(this).find(".foreTemp").text("Temp: " + inFahrenheit(infoData.daily[index].temp.day));
                $(this).find(".foreHumid").text("Humid: " + infoData.daily[index].humidity);
                index++
            });
        }
    });
});
