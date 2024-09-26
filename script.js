const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY = 'c32078148893d6c70c36b938698f2c95';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hourIn12HrFormat = hour >= 13 ? hour % 12 : hour
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hourIn12HrFormat < 10 ? '0' + hourIn12HrFormat: hourIn12HrFormat) + ':' + (minutes < 10 ? '0' + minutes: minutes) + ' ' + `<span id="am-pm">${ampm}</span>`
    dateEl.innerHTML = days[day] + ',' + date + ' ' + months[month]
}, 1000);

getWeatherData()
function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        console.log(success);

        let { latitude, longitude } = success.coords;

        // fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&appid=${API_KEY}`)
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`)
        .then(res => res.json())
        .then (data => {
            console.log(data);
            showWeatherData(data);
        })
    })
}

function showWeatherData(data) {
    // let { humidity, pressure } = data.main;
    // let { speed: wind_speed } = data.wind;
    // let { sunrise, sunset } = data.sys; 
    const currentWeather = data.list[0]; // Get the first forecast entry
    const { main, wind } = currentWeather; // Destructure the required properties
    const { humidity, pressure } = main;
    const { speed: wind_speed } = wind;
    // const { sunrise, sunset } = sys; 
    
    timezone.innerHTML = data.timezone;
    countryEl.innerHTML = `${data.city.coord.lat}N, ${data.city.coord.lon}E`
    
    currentWeatherItemsEl.innerHTML = 
    `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
        
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}m/s</div>
    </div>`;

    let otherDayForecast = '';
    data.list.forEach((forecast, idx) => {
        // if(idx === 0) {
        //     currentTempEl.innerHTML = `<img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"alt="weather-icon" class="w-icon">
        //     <div class="other">
        //         <div class="day">${new Date(day.dt*1000).format('ddd')}</div>
        //         <div class="temp">Night - ${day.temp.night}&#176; C</div>
        //         <div class="temp">Day - ${day.temp.day}&#176; C</div>
        //     </div>`
        // }
        // else {
        //     otherDayForecast += `<div class="weather-forecast-item">
        //         <div class="day">${new Date(day.dt * 1000).format('ddd')}</div>
        //         <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"alt="weather-icon" class="w-icon">
        //         <div class="temp">Night - ${day.temp.night}&#176; C</div>
        //         <div class="temp">Day - ${day.temp.day}&#176; C</div>
        //     </div>`

        //     weatherForecastEl.innerHTML = otherDayForecast;
        // }

        if (idx % 8 === 0) {
            otherDayForecast += `<div class="weather-forecast-item">
                <div class="day">${new Date(forecast.dt * 1000).toLocaleDateString('en', { weekday: 'short' })}</div>
                <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="weather-icon" class="w-icon">
                <div class="temp">Night - ${forecast.main.temp_min}&#176;C</div>
                <div class="temp">Day - ${forecast.main.temp_max}&#176;C</div>
            </div>`;
        }
    });
    weatherForecastEl.innerHTML = otherDayForecast;

}
