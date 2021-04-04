// new code strt here
// rquire deandances
require('dotenv').config()

const express = require('express')
const cors =require('cors')
const superagent = require ('superagent')
const pg = require('pg')



//our keys
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

const NODE_ENV = process.env.NODE_ENV;


// Setup our connection options based on environment
const options = NODE_ENV === 'production' ? { connectionString: DATABASE_URL , ssl: { rejectUnauthorized: false } } : { connectionString: DATABASE_URL };

const client = new pg.Client(options); // initiate pg DATABASE with specified url;







//set up the database

//set up enviroment vars
const PORT = process.env.PORT || 3000 
// set up our server
const app = express()
app.use(cors())
// basic rote to show our server working
// app.get('*',(req,res)=>{
//     console.log('working')
//     res.send('woooork')
// })
// our needs rout 
app.get('/location', handleLocation)

app.get('/weather', handleweather)
app.get('/parks', handleparks)
app.get('/movie', handlemovie)
app.get('/yelp', handleyelp)
// app.use('*', unFound)


client.connect().then( () => {
  app.listen(PORT);
  console.log('listening to port');

})

//controllers(modify our data)
function  handleLocation(req,res){
  console.log("hello");
//get city from query that the user inter to explor
const city = req.query.city
console.log('helloo',city);
//use city to requst data from DATABASE
//$1 THE FIRST VALUE OF TABLE
const citySql='SELECT * FROM location WHERE search_query =$1; '
const sqlArr =[city]
//for the API
const url ='https://us1.locationiq.com/v1/search.php'
const queryParans ={
  key:GEOCODE_API_KEY,
  format:'json',
  q :city,
  //to limit one response
  limit :1
}

//code to run query
client.query(citySql,sqlArr)
.then((dataFromDb)=>{
  if (dataFromDb.rowCount === 0 ){
    //use city to request data from API
    superagent.get(url,queryParans).then(dataFromApi =>{
 console.log('here data from API')
 // GET data from the body
 const data  =dataFromApi.body[0]
 //make new instance fir the data
 const cityLocation = new Location(city,data.display_name,data.lat,data.lon)
 //store data in db
 const insertCity ='INSERT INTO location (search_query,formatted_query,latitude,longitude) VALUES ($1,$2,$3,$4);'
client.query(insertCity,[city,data.display_name,data.lat,data.lon])
//respone data to the clint
res.send(cityLocation)
    })


  }
  else{
    const data =dataFromDb.rows[0]
  //use constructor to make new instance
  const cityLocation = new Location(city,data.formatted_query,data.latitude,data.longitud)
  //send data back to the clint as aresponse
  res.send(cityLocation)
}
}).catch(internalError(res))}

   




function  handleweather (req,res) {

  //get query params
  const city = req.query.search_query;
  //send call to api
  const url ='https://api.weatherbit.io/v2.0/forecast/daily'
  const queryParams ={
    city,
    key:WEATHER_API_KEY
  }
  superagent.get(url,queryParams).then(dataFromApi =>{
    //constructor wethen object
    const wether =dataFromApi.body.data.map(data => new Weather (data.weather.description,data.datetime))
    //response to clint
    res.send(wether)
  }).catch(internalError(res))}
  
// }


function  handleparks (req,res) {
  let city = req.query.search_query;
  const key = process.env.PARKS_API_KEY;
  const url = `https://developer.nps.gov/api/v1/parks?q=${city}&api_key=${key}`;

  superagent.get(url)
      .then(allParks => {
          const newPark = allParks.body.data.map(littleAboutPark => {
              // console.log(littleAboutPark.description)
              return new Park(littleAboutPark.fullName, littleAboutPark.addresses[0].line1 + littleAboutPark.addresses[0].city, littleAboutPark.entranceFees[0].cost, littleAboutPark.description, littleAboutPark.url);
          })
          res.status(200).send(newPark)
      })
      .catch(internalError(res))}





  
  

function  handlemovie (req,res) {
  let city = req.query.search_query;
    const key = process.env.MOVIE_API_KEY;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${city}`;

    superagent.get(url)
        .then(movies => {
            console.log(movies.body.results);
            const movieData = movies.body.results.map(movieData => {
                return new Movie(movieData)
            })
            res.status(200).send(movieData)
        })
        .catch(internalError(res))}


  


function  handleyelp (req,res) {
  
  const key = process.env.YELP_API_KEY;
    const url = `https://api.yelp.com/v3/businesses/search?location=${req.query.city}`

    superagent.get(url)
        .set(`Authorization`, `Bearer ${key}`)
        .then(yelp => {
            // console.log(yelp.body.businesses);
            const yelpNeeded = yelp.body.businesses.map(yelpData => {
                return new Yelp(yelpData)
            })
            res.status(200).send(yelpNeeded)
        })
        .catch(internalError(res))}







//Errors
// function unFound (req,res) {
//   res.status(404).send('not found here')
  
// }
function internalError (res) {
  return (error)=>{
    res.send('there is wrong')
  }
  
}


//model (OUR constuctor function)

function Location (search_query,formatted_query,latitude,longitude) {

  
           this.search_query= search_query;
             this.formatted_query= formatted_query;
              this.latitude=latitude;
              this.longitude= longitude;
}
function Weather (forecast, time) {
  this.forecast =forecast ;
  this.time = time;
}

function Park (name, address, fee, description, url) {
  this.name = name;
  this.address = address;
  this.fee = fee;
  this.description = description,
  this.url = url
}

function Movie (movieData) {
  this.title = movieData.title;
  this.overview = movieData.overview;
  this.average_votes = movieData.vote_average;
  this.total_votes = movieData.vote_count;
  this.image_url = `https://image.tmdb.org/t/p/w500${movieData.poster_path}`;
  this.popularity = movieData.popularity;
  this.released_on = movieData.release_date;
}

function Yelp(yelpData) {
  this.name = yelpData.name;
  this.image_url = yelpData.image_url;
  this.price = yelpData.price;
  this.rating = yelpData.rating;
  this.url = yelpData.url;
}

