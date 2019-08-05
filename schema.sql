DROP TABLE IF EXISTS locations, weather;


CREATE TABLE IF NOT EXISTS locations (
id SERIAL PRIMARY KEY,
search_query  VARCHAR(255), 
formatted_query VARCHAR(255), 
latitude NUMERIC(10,7), 
longitude NUMERIC(10,7)
);

CREATE TABLE IF NOT EXISTS weather (
id SERIAL PRIMARY KEY,
forecast TEXT,
time VARCHAR(255)
);
