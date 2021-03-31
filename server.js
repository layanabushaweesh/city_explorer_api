
'use strict'; 
// load enviroment variable its the first step
const dotenv = require('dotenv'); 
dotenv.config();
// includ app depancies
const express = require('express'); 
const superAgent =require('superagent')
const cors = require('cors');

//set up our app
let app = express();

//set up envitoment variables
const PORT = process.env.PORT || 3000; 
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const PARKS_API_KEY = process.env.PARKS_API_KEY;

//set our application midlewear 
app.use(cors()); 
//our route middleweard
app.get('/location', handleLocation); 
app.get('/weather', handleWeather); 
app.get('/parks', handlePark); 
app.use('*',handleError)
app.listen(PORT, () => {
 console.log(`the app is listen to ${PORT}`); 
})

//FUNction for each path
function handleLocation(req, res) {
    const url = 'https://us1.locationiq.com/v1/search.php?key=' + GEOCODE_API_KEY + '&q=' + req.query.city + '&format=json&limit=1';
    superAgent.get(url).then(locationData => {
        const data = locationData.body[0];
        res.status(200).json(new Location(req.query.city, data.display_name, data.lat, data.lon));
    }).catch((error) => {
        console.log(error);
        res.status(500).send('wrong');
    })
   
}

async function handleWeather(req, res) {
    try {
        const city = req.query.search_query;

        const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${WEATHER_API_KEY}`;
        const rawWeatherData = await superAgent.get(url);
        const weatherData = JSON.parse(rawWeatherData.text).data;

        const forecasts = weatherData.map(element => {
            const description = element.weather.description;
            const time = element.datetime;
            return new Weather(description, time);
        });
        res.json(forecasts);
    } catch (error) {
        console.log(error);
        res.status(500).send(' wrong');
    }
   
}
function handlePark (req, res) {
    const url = `https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=${PARKS_API_KEY}`;
    superAgent.get(url).then(parksData => {
        const parks = parksData.body.data.map(data => {
            const name = data.fullName;
            const address = data.addresses[0].line1 + data.addresses[0].city;
            const sun = data.entranceFees[0].cost;
            const description = data.description;
            const parkURL = data.url;
            return new Park(name, address, sun, description, parkURL)
        });
        res.status(200).json(parks);
    }).catch((error) => {
        console.log(error);
        res.status(500).send(' wrong');
    })
}

function handleError (req,res) {
    console.log(req)
    res.status(404).send(`cant get ${req.baseUrl}`)
} 


function Location(name, location, latitude, longitude) {
    this.search_query = name;
    this.formatted_query = location;
    this.latitude = latitude;
    this.longitude = longitude;
}

function Park(name, address, sun, description, url) {
    this.name = name;
    this.address = address;
    this.sun = sun;
    this.description = description;
    this.url = url;
}
function Weather(description, valid_date) {
    this.forecast = description;
    this.time = valid_date;
}




    app.listen(PORT, () => {
        console.log(`listin port ${PORT}`);
    });









