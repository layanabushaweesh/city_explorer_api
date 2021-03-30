'use strict';
const pg = require('pg');

const options = NODE_ENV === 'production' ? { connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } } : { connectionString: DATABASE_URL};
const client = new pg.Client(options);
client.on('error', err => { throw err; });


client.connect().then(() => {
 


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
    const pg = require('pg');

    const options = NODE_ENV === 'production' ? { connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } } : { connectionString: DATABASE_URL};
    const client = new pg.Client(options);
    client.on('error', err => { throw err; });
    
    
    client.connect().then(() => {
     
    
   
            })
            .catch((err) => errorHandler(err, request, response));
    }

    function errorHandler(error, req, res) {
        res.status(500).send(error);
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






    app.listen(PORT, () => {
        console.log(`listin port ${PORT}`);
    });








