const apiKey = "";
const form = document.querySelector("form");
const selectWrapper = document.querySelector(".select-wrapper");
const select = document.querySelector("#country-select");
const cityInput = document.querySelector('#City');
const resultSection = document.getElementById("result");
const msg = document.querySelector(".msg");


class WeatherCity {

    constructor(name, main, temp, feelsLike, country){
        this.name = name;
        this.temp = Math.round(temp);
        this.main = main;
        this.feelsLike = Math.round(feelsLike);
        this.country = country;
    }

    render(){
        const container = document.createElement('div');
        container.classList.add("weather-card");
        container.innerHTML = `<h4>${this.name}</h4>
            <p>${this.country}</p>
            <span>${this.temp}°C</span>
            <p>Feels like ${this.feelsLike}°C</p>`;

        return container;
    }
}


document.querySelector("form").addEventListener("submit", async function(e) {
    e.preventDefault(); 
    
    const query = cityInput.value.trim();
    select.innerHTML = "";
    // select.style.display = "none";
    msg.textContent = "";

    if(!query){
        msg.textContent = "Please enter a city name.";
        return;
    }

    try{
        const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`);
        const cities = await geoRes.json();

        if (cities.length == 0){
            msg.textContent = "No matching cities found";
            return;
        }

        selectWrapper.style.visibility = "visible";

        cities.forEach(city => {
            const option = document.createElement("option");
            option.value = JSON.stringify(city);
            option.textContent = `${city.name}, ${city.country}${city.state ? " - " + city.state : ""}`;
            select.appendChild(option)
        })

        select.style.display = "inline-block";
    } catch(error){
        msg.textContent = "Error fetching location data.";
        console.error(error);
    }
});

select.addEventListener("change", async () => {
    const cityData = JSON.parse(select.value);
    const {lat, lon, name, country} = cityData;
    try{
        const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        const weather = await weatherRes.json();

        const card = new WeatherCity(weather.name, weather.weather[0].main, weather.main.temp - 273.15,  weather.main.feels_like - 273.15, weather.sys.country);
        resultSection.append(card.render());

    } catch(error){
        msg.textContent = "Error fetching weather data.";
        console.error(error);
    }
})


