const apiKey = "";

const themeSwitch = document.querySelector("#toggle-theme");

const form = document.querySelector("form");
const selectWrapper = document.querySelector(".select-wrapper");
const select = document.querySelector("#country-select");
const cityInput = document.querySelector('#City');
const msg = document.querySelector(".msg");

const resultSection = document.getElementById("result");

const toggleSelect = document.querySelector("#toggle-select");
const deleteBtn = document.getElementById("delete-selected");
let selectMode = false;

class WeatherCity {

    constructor(name, main, temp, feelsLike, country, iconCode){
        this.name = name;
        this.temp = Math.round(temp);
        this.main = main;
        this.feelsLike = Math.round(feelsLike);
        this.country = country;
        this.iconCode = iconCode;
    }

    get id(){
        return `${this.name}-${this.country}`;
    }

    render() {
    const container = document.createElement('div');
    container.classList.add("weather-card");
    container.dataset.id = this.id;

    const iconUrl = `https://openweathermap.org/img/wn/${this.iconCode}@2x.png`;

    container.innerHTML = `
        <label class="card-checkbox">
            <input type="checkbox" class="delete-checkbox" />
        </label>
        <h4>${this.name}</h4> <p> ${this.country}</p>
        <div class="main-info">
        <img src="${iconUrl}" alt="${this.main}" class="weather-icon" />
        <span class="weather-temp">${this.temp}°C</span>
        </div>
        <p class="weather-feels">feels like: ${this.feelsLike}°C</p>
        <div class="weather-desc">${this.main}</div>
    `;

    return container;
}
}

// === LOCAL STORAGE ===
function getSavedCities() {
    return JSON.parse(localStorage.getItem("weatherCities") || "[]");
}

function saveCities(data) {
    localStorage.setItem("weatherCities", JSON.stringify(data));
}

function renderSavedCities() {
    const saved = getSavedCities();
    saved.forEach(city => {
        const card = new WeatherCity(
            city.name,
            city.main,
            city.temp,
            city.feelsLike,
            city.country,
            city.iconCode
        );
        resultSection.append(card.render());
    });
}


// === THEME CHANGE ===
themeSwitch.addEventListener("click", function(){
    if(this.checked){
    document.querySelector("body").classList.add("dark-mode");}
    else{
        document.querySelector("body").classList.remove("dark-mode");
    }
})


// === FORM SUBMIT ===

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
        select.value = "";

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

        const city = new WeatherCity(weather.name, weather.weather[0].main, weather.main.temp - 273.15,  weather.main.feels_like - 273.15, weather.sys.country, weather.weather[0].icon);
        resultSection.append(city.render());

        const saved = getSavedCities();
        saved.push(city);
        saveCities(saved);

    } catch(error){
        msg.textContent = "Error fetching weather data.";
        console.error(error);
    }
})


// === TOGGLE SELECT MODE ===

toggleSelect.addEventListener('click', () => {
    if(document.querySelectorAll(".weather-card").length === 0) return;

        selectMode = !selectMode;
        toggleSelect.textContent = selectMode ? "Cancel selection" : "Select locations";

        document.querySelectorAll(".weather-card").forEach(card => {
            if (selectMode) {
                card.classList.add("select-mode");
            } else{
                    card.classList.remove('select-mode');
                    card.querySelector(".delete-checkbox").checked = false;
            }
        })

        deleteBtn.style.display = selectMode ? "inline-block" : "none";
    }  
)


// === DELETE CARDS ===

deleteBtn.addEventListener("click", () => {
    const checked = document.querySelectorAll(".delete-checkbox:checked");
    const deleteIDs = [];

    checked.forEach(cb => {
        const card = cb.closest(".weather-card");
        if (card){
            deleteIDs.push(card.dataset.id);
            card.remove();
        }
    })

    const saved = getSavedCities();
    const updated = saved.filter(city => !deleteIDs.includes(`${city.name}-${city.country}`));
    saveCities(updated);

    if (document.querySelectorAll(".weather-card").length === 0){
        selectMode = false;
        toggleSelect.textContent = "Select locations";
        deleteBtn.style.display = "none";
    }}
)

document.addEventListener("DOMContentLoaded", renderSavedCities);