<<<<<<< HEAD
'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();

const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;
const NODE_ENV = process.env.NODE_ENV;
// Application Dependencies
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
app.use(cors());
//for database
const pg = require('pg');
const options = NODE_ENV === 'production' ? { connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } } : { connectionString: DATABASE_URL};
const client = new pg.Client(options);


const client = new pg.Client(DATABASE_URL);
//like event lister
client.on('error', err => { throw err; });

// This will only start JUST if we can successfully connect to the database
client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`App listen to port ${PORT}`);
    })
});


// App Setup:
//creating the server application
const app = express(); 
const PORT = process.env.PORT || 3000;

// API Routes:
app.get('/', (req, res) => {
    res.status(200).send('Ok!');
    console.log(req.query);
});




//route for location,wether,error
app.get('/location', handleLocation);

app.get('/weather', handleWeather)


app.use('*', notFoundHandler)
app.get('/parks', handlePark );

// function for rote
function handleLocation(req, res) {

    const city = req.query.city;
    // get the city saved data
    const sql = 'SELECT * FROM TABLES WHERE name = $1';
    client.query(sql,[city]).then(citySavedData =>{
        if(citySavedData.rowCount == 0){
            try{
                // city  not in  listed in the table
                const url = 'https://us1.locationiq.com/v1/search.php?key=' + GEOCODE_API_KEY + '&q=' + city + '&format=json&limit=1';
                requestAgent.get(url).then(locationData => {
                    const data = locationData.body[0];
                    // add to database commands
                    const addSql = 'INSERT INTO TABLES (name, location, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *';
                    const dataLocation = [city, data.display_name, data.lat, data.lon];
                    client.query(addSql,dataLocation).then(data => {
                        console.log('saved')
                    })
                    res.status(200).json(new Location(city, data.display_name, data.lat, data.lon));
                })
            }catch(error){
                res.status(404).send('not found');
            }
        }else{
            res.status(200).json(new Location(citySavedData.rows[0].name, citySavedData.rows[0].location, citySavedData.rows[0].latitude, citySavedData.rows[0].longitude));
        }
    })
}


    function notFoundHandler(error, req, res) {
        res.status(500).send(error);
    }
    
    
    // async function handleWeather (req, res)  {
    //     let values = Object.keys(req.query);
    //     let url;
    //     console.log(values)
    //     if (values[0] == "search_query"){
    //         url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${req.query.search_query}&key=${WEATHER_API_KEY}`
    //     }else{
    //         url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${req.query.name}&key=${WEATHER_API_KEY}`
    //     }
    //     try{
           
    //         })
    //         res.status(200).send(neededData);
    //     }catch(error){
    //         res.status(404).send('it is not found');
    //     }



    // function handlePark (request, response)  {
    //     try{
    //         const url = 'https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=' + PARKS_API_KEY;
    //         requestAgent.get(url).then(parksData => {
                
    //         })
    //     }catch(error){
    //         response.status(404).send('it is not found');
    //     }
    








    

    function Location(name, location, latitude, longitude) {
        this.search_query = name;
        this.formatted_query = location;
        this.latitude = latitude;
        this.longitude = longitude;
    }
    function Weather(description, valid_date) {
        this.forecast = description;
        this.time = valid_date;
    }
    function Park(name, address, fee, description, url) {
        this.name = name;
        this.address = address;
        this.fee = fee;
        this.description = description,
        this.url = url;
    }
=======
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
>>>>>>> main
