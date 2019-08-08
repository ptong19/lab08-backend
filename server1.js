








function searchToLatLong(query){

  let city = lookupLocation(query);
  if (city){
    return city;
  } else {
    const url =`https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GEOCODE_API_KEY}`;
    return superagent.get(url)
      .then(res => {
        // return new City(query, res.body.results[0])
        //   .then(city =>{
            postLocation(city);
          });
      });

  }
 
}



let postLocation = (location) => {
  let SQL = `INSERT INTO locations (search_query, formatted_query, latitude, longitude)VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING RETURNING id;`;
  const values = [this.searc.query, this.formatted_query, this.latitude, this.longitude];

};

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

