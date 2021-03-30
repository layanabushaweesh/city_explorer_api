'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const locations = {};


// App Setup:
const app = express(); //creating the server application
const PORT = process.env.PORT || 3000;
app.use(cors());

// API Routes:
app.get('/', (req, res) => {
    res.status(200).send('Ok!');
    console.log(req.query);
});
//route for location,wether,error
app.get('/location', handleLocation);

app.get('/weather', handleWeather)

app.use('*', notFoundHandler)
// function for rote
function handleLocation(req, res) {

    let city = req.query.city;
    let key = process.env.GEOCODE_API_KEY;
    const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json&limit=1`;

    if (locations[url]) {
        res.send(locations[url]);
    } else {
        superagent.get(url)
            .then(data => {
                console.log(data);
                const geoData = data.body[0];
                const locationInfo = new Location(city, geoData);
                locations[url] = locationInfo;
                res.send(locationInfo);
            })
            .catch((err) => errorHandler(err, request, response));
    }

    function errorHandler(error, req, res) {
        res.status(500).send(error);
    }
    
    function notFoundHandler(req, res) {
        res.status(404).send('not found!');
    }
    
    function CityLocation(srchQ, dsplyNam, lat, long) {
        this.search_query = srchQ;
        this.formatted_query = dsplyNam;
        this.latitude = lat;
        this.longitude = long;
    }
    
    function CityWeather(srchQ, wthrDesc, time) {
        this.search_query = srchQ;
        this.forecast = wthrDesc;
        this.time = time;
    }


function handleWeather(req, res) {
    try {
        const weather = require('./data/weather.json');
        const weatherRender = [];
        weather.data.map(day => {
            weatherRender.push(new Weather(day));

        })
        res.status(200).json(weatherRender);

    } catch (error) {
        errorHandler(error, request, response);
    }
};




    app.listen(PORT, () => {
        console.log(`listin port ${PORT}`);
    });





}