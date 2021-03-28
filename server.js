'use strict'
// load the express mod. to our script
require('dotenv').config(); 
const cors = require('cors');
app.use(cors());

// value of port
const PORT = process.env.PORT || 3000;

// Creates a server application.

const app = express();
//constructor fun for location
function Location(name,location,latitude,longitude){
    this.search_query =  name,
    this.formatted_query = location,
    this.latitude = latitude,
    this.longitude = longitude
}


//set a rout for handle
// handle to get request to yhe path
app.get('/location',handleLocation )

//request are handle bt call back
//express need parameter
const handleLocation = (request, response,next) => {

 const dataArr = require('./data/location.json');
    const data = dataArr[0];
    response.status(200).json(new Location(request.query.city,data.display_name,data.lat,data.lon));
    next();


}

//constructor for wether
function Weather(description,valid_date){
    this.forecast = description,
    this.time = valid_date;
}

//set a rout for handle
// handle to get request to yhe path

app.get('/weather', handleWether )

const handleWether = (request, response)=>{

    const objData = require('./data/weather.json');
    const weatherData = objData.data;
    const returnedData = [];
    weatherData.forEach(a=>{
        returnedData.push(new Weather(a.weather.description,a.valid_date))
    })
    response.status(200).json(returnedData);
}





//we should add lisnter to the port
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
