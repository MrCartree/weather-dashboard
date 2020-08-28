const apiKey = "e50c991dffb6aa38fe794e7859d8d281";
const storedCities = localStorage.getItem("allCities");
const citySet = new Set(JSON.parse(storedCities));
let cityNameInput = $("#input");
const weatherIcons = {
    "clear sky": "assets/images/sunnyWeather.png",
    "few clouds": "assets/images/cloudyWeather.png",
    "scattered clouds": "assets/images/cloudyWeather.png",
    "broken clouds": "assets/images/cloudyWeather.png",
    "shower rain": "assets/images/rainyWeather.png",
    rain: "assets/images/rainyWeather.png",
    thunderstorm: "assets/images/stormyWeather.png",
    snow: "assets/images/snowyWeather.png"
}

// this is the api url with my api key plugged in
function forecastURL(cityName) {
    return `https://api.openweathermap.org/data/2.5/forecast?q=${cityName},us&APPID=${apiKey}`
}

// function to change temp from kelvin to fahrenheit
function inFahrenheit(kelvin) {
    return ((kelvin - 273.15) * 1.80 + 32).toFixed(2);
}
// Date string function
function dateString(dateObject) {
    let month = dateObject.toLocaleString("en-US", { month: "numeric" });
    let day = dateObject.toLocaleString("en-US", { day: "numeric" });
    let year = dateObject.toLocaleString("en-US", { year: "numeric" });
    return `${month}/${day}/${year}`;
}

function updateView(requestedCity) {
    let forecast = forecastURL(requestedCity);
    $.ajax(forecast).then(function (response) {
        console.log(response);
        citySet.add(requestedCity);
        const JSONString = JSON.stringify([...citySet]);
        localStorage.setItem("allCities", JSONString);
        updateCityList();
        let lattitude = response.city.coord.lat;
        let longitude = response.city.coord.lon;
        const now = new Date();
        $("#cityName").text(`${response.city.name} ${dateString(now)}`);
        $("#temperature").text("Temperature: " + inFahrenheit(response.list[0].main.temp));
        $("#humidity").text("Humidity: " + response.list[0].main.humidity + "%");
        $("#windSpeed").text("Wind Speed: " + response.list[0].wind.speed + "MPH");

        // second call gathing the information for the UV index and putting it on the page as well as gathering the Forecast information
        $.ajax(uvIndexUrl()).then(function (info) {
            console.log(info);
            $("#uvIndex").text("UV Index: " + info.current.uvi);
            // if statments to give a nice color to the UV Index dependant on the risk level.
            if (info.current.uvi <= 2) {
                $("#uvIndex").addClass("uvIndexG")
            } else if (info.current.uvi > 2 && info.current.uvi <= 3) {
                $("#uvIndex").addClass("uvIndexY");
            } else if (info.current.uvi > 5 && info.current.uvi <= 7) {
                $("#uvIndex").addClass("uvIndexO");
            } else {
                $("#uvIndex").addClass("uvIndexR")
            }


            dateConversion(info);
        });

        // second api call to use lon and lat
        function uvIndexUrl() {
            return `https://api.openweathermap.org/data/2.5/onecall?lat=${lattitude}&lon=${longitude}&exclude=minutely,hourly&appid=${apiKey}`
        }

        // Creating a function that will take the info from this specific page and convert the Unix Time to an understandable date.
        let index = 1;
        function dateConversion(infoData) {
            $(".forecastCard").each(function () {
                let dateTime = infoData.daily[index].dt;
                const milliseconds = dateTime * 1000;
                const dateObject = new Date(milliseconds);
                $(this).find(".date").text(dateString(dateObject));
                $(this).find(".foreTemp").text("Temp: " + inFahrenheit(infoData.daily[index].temp.day));
                $(this).find(".foreHumid").text("Humid: " + infoData.daily[index].humidity);
                index++
            });
        }
    });
}

function updateCityList() {
    $(".srchd").text("");
    citySet.forEach(function (aCity) {
        let liEl = $(`<li>${aCity}</li>`);
        $(".srchd").append(liEl);
        liEl.click(function() {
            updateView(aCity);
        });
    });
}

// api call on click of the search button which returns the information from the api library
$("#srchBtn").click(function () {
    let chosenCity = cityNameInput.val();
    updateView(chosenCity);
});

updateCityList();
