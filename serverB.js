'use strict';

// these are our application dependencies
const express = require('express');
const app = express();
const superagent = require('superagent');

//add cors and superagent
const cors = require('cors');
app.use(cors());

// configure environment variables
require('dotenv').config();
const PORT = process.env.PORT || 3000;

// tell our express server to start listening on port PORT
app.listen(PORT, () => console.log(`listening on port ${PORT}`));

//routes to handle user request and send the response from our database
app.get('/location', (req,res) => {
  searchToLatLong(req.query.data)
    .then(location => res.send(location));
});

app.get('/weather', (request, response) => {
  try {
    const weatherData = getWeather();
    response.send(weatherData);
  }
  catch(error) {
    console.error(error);
    response.status(500).send('Status: 500. Server error in /weather');
  }
});

function getWeather() {
  const darkskyData = require('./data/darksky.json');
  const weatherSummaries = [];
  darkskyData.daily.data.map((day) => {
    weatherSummaries.push(new Weather(day));
  });
  return weatherSummaries;
}

// constructor function to buld a city object instances
function City(query, data){
  this.search_query = query;
  this.formatted_query = data.body.results[0].formatted_address;
  this.latitude = data.body.results[0].geometry.location.lat;
  this.longitude = data.body.results[0].geometry.location.lng;
}

//weather constructor
function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}

function searchToLatLong(query){
  const url =`https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GEOCODE_API_KEY}`;
  return superagent.get(url)
    .then(res => {
      return new City(query, res);
    });
}
