'use strict';

//======================== Globla Variables and appplication dependensies ================================//

// these are our application dependencies
const express = require('express');
const app = express();

//add cors and superagent
const cors = require('cors');
app.use(cors());
const superagent = require('superagent');

// configure environment variables
require('dotenv').config();
const PORT = process.env.PORT || 3000;

const pg = require('pg');

//connection to the client
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));


// tell our express server to start listening on port PORT
app.listen(PORT, () => console.log(`listening on port ${PORT}`));

//=======================================================================================================//


//============================== Location Feature ==========================================================//

//route to handle user request and send the response from our database or GOOGLE
app.get('/location', (req,res) => {
  // let city = lookupLocation(req.query.data);
  // city(req.query.data);
  lookupLocation(req.query.data);
  
  if (lookupLocation(req.query.data) === true){
    return lookupLocation(req.query.data);
  } 
  else {

    //req.query.data gives us actual string value of users input
    searchToLatLong(req.query.data)

    //when we got a return from searchLatLong then this return will be used to send as the response
      .then(location =>{
        // postLocation(location);
        res.send(location);
        postLocation(location);
      });

  }
});

//function to search for the location latitude and longitude using geocode epi key
function searchToLatLong(query){
  const url =`https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GEOCODE_API_KEY}`;
  //using our superagent library to get the proper data format
  return superagent.get(url)
  //then when we got the data from superagent create a new City object with the query (location name) and data (res.body.results[0]);
    .then(res => {
      // let SQL = `INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING RETURNING id;`;
      // const values = [this.search_query, this.formatted_query, this.latitude, this.longitude];

      // client.query(SQL, values)
      //   .then (result => console.log(`location ${location} and result ${result} inserted `));

      return new City(query, res.body.results[0]);
        
        
    });

}

// constructor function to buld a city object instances, paths based on the geo.json file
function City(query, data){
  this.search_query = query;
  this.formatted_query = data.formatted_address;
  this.latitude = data.geometry.location.lat;
  this.longitude = data.geometry.location.lng;
}

//=============================================================================================================//


//============================== Weather feature =================================================================//

//route to handle user request and send the response from our database or DarkSky
app.get('/weather', (req, res) => {
  const api_url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${req.query.data.latitude},${req.query.data.longitude}`;
  return superagent.get(api_url)

    .then(weatherDisplay => {
      let weatherSummaries = [];   ///array to store our days weather summaries
      weatherDisplay.body.daily.data.map((day) => {
        weatherSummaries.push(new Weather(day));  //create new Weather object and push it to weather Summaries
      });
      res.send(weatherSummaries); //send WeatherSummaries array as a response
    });

});


//weather constructor build base on the darksky.json file paths
function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString(); //converting UNix timestamp to regular time
}

//=============================================================================================================//


//============================== DataBase Helper Functions==========================================================//

//check if data from SQL DB contains requested location 
let lookupLocation = (location) =>{
  let SQL = `SELECT * FROM locations WHERE search_query=$1`;
  let values = [location.query];
  console.log('location          ' + location);

  return client.query(SQL, values)
    .then(result => {
      console.log(result);
      if (result.rowCount > 0){
        // if so return location data
        console.log('result.rows[0]     ' + result.rows[0]);
        return new City(result.rows[0]);
      } else {
        return null;
      }

    });
};

let postLocation = (location) => {
  let SQL = `INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($val1, $val2, $val3, $val4) ON CONFLICT DO NOTHING RETURNING id;`;
  const values = [location.search_query, location.formatted_query, location.latitude, location.longitude];

  return client.query(SQL, values)
    .then (result => console.log(`location ${location} and result ${result} inserted `));

};
//=============================================================================================================//


