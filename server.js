'use strict'; 

// this code i weite it after code wrviwe
const dotenv = require('dotenv'); 
dotenv.config();
const PORT = process.env.PORT || 3000; 
const express = require('express'); 
let app = express(); 

const cors = require('cors');

app.use(cors()); 

app.get('/location', handleLocation); 
app.get('/weather', handleWeather); 

app.get('*', handleErrors); 



function handleLocation(req, res) {
    try {
        let srchQ = req.query.city; 
        let locationObj = locationData(srchQ); 
        res.status(200).json(locationObj);
    } catch (error) {
        res.status(500).send(`wrong ${error}`);
    }
}

function handleWeather(req, res) {
    let searchQuery = req.query.city;
    let wthrObj = dataWether(searchQuery);
    try {
        res.status(200).send(wthrObj);
    } catch (error) {
        res.status(500).send(` wrong ${error}`);
    }
}
function handleErrors(req, res) {
    res
        .status(404)
        .send({ status: 404, responseText: 'Sorry not exist' });
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


function dataWether(searchQuery) {
    let wthrData = require('./data/weather.json');
    let wthrArry = [];
    for (let i = 0; i < wthrData.data.length; i++) {
        let weatherDesc = wthrData.data[i].weather['description'];
       
    
        let resObj = new CityWeather(searchQuery, weatherDesc, newDate);
        wthrArry.push(resObj);
    }
    return wthrArry;
}

function locationData(searchQuery) {
   
    let locationData = require('./data/location.json');
    let displayName = locationData[0].display_name;
    let latitude = locationData[0].lat;
    let longitude = locationData[0].lon;
    let resObj = new CityLocation(searchQuery, displayName, latitude, longitude);
    return resObj;
}
app.listen(PORT, () => {
    
    console.log(`the app is listening to ${PORT}`); /
})