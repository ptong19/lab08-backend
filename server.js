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

// constructor function to buld a city object instances
function City(query, data){
  this.search_query = query;
  this.formatted_query = data.body.results[0].formatted_address;
  this.latitude = data.body.results[0].geometry.location.lat;
  this.longitude = data.body.results[0].geometry.location.lng;
}

function searchToLatLong(query){
  const url =`https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GEOCODE_API_KEY}`;
  return superagent.get(url)
    .then(res => {
      return new City(query, res);
    });
}


app.get('/weather', (req, res) => {
  const api_url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${req.query.data.latitude},${req.query.data.longitude}`;
  return superagent.get(api_url)
    .then(weatherDisplay => {
      const weatherSummaries = [];
      weatherDisplay.body.daily.data.map((day) => {
        weatherSummaries.push(new Weather(day));
      });
      res.send(weatherSummaries);
    });

});

//weather constructor
function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}


// app.get('/event', (req, res) => {
//   const api_url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${req.query.data.latitude},${req.query.data.longitude}`;
//   return superagent.get(api_url)
//     .then(eventDisplay => {
//       const weatherSummaries = [];
//       weatherDisplay.body.daily.data.map((day) => {
//         weatherSummaries.push(new Weather(day));
//       });
//       res.send(weatherSummaries);
//     });

// });
// // //Eventbrite constructor
// function Eventbrite(){
//   this.link = 
//   this.name = event[0].name
//   this.event_date=
//   this.summary = 
// }


