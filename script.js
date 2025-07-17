var apiKey = "your key";

var searchBtn = document.querySelector('#search-btn');

var resultSection = document.getElementById("#result");

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
        container.innerHTML = `<h4>${this.name}</h4>
            <p>${this.country}</p>
            <span>${this.temperature}°C</span>
            <p>Feels like ${this.feelsLike}°C<</p>`;

        return container;
    }
}

searchBtn.addEventListener("click", searchForWeather);

document.querySelector("form").addEventListener("submit", function(e) {
    e.preventDefault(); 
    const city = document.querySelector("#City").value;
    searchForWeather(city);
});


const searchForWeather = function() {
    let city = document.querySelector('#City').value;
    
}
