import React, { useState, useEffect } from 'react';
import Axios from 'axios';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [countryData, setCountryData] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const weatherStackApiKey = process.env.REACT_APP_WEATHERSTACK_API_KEY;

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setCountryData(null);
      return;
    }

    const timer = setTimeout(() => {
      fetch(`https://restcountries.com/v3/name/${searchQuery}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 404) {
            setCountryData(null);
          } else if (data.length > 10) {
            setCountryData(null);
          } else {
            setCountryData(data);
          }
        })
        .catch((error) => {
          console.error('Error fetching country data:', error);
          setCountryData(null);
        });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const showCountryDetails = (country) => {
    setSelectedCountry(country);

    Axios.get(`http://api.weatherstack.com/current?access_key=${weatherStackApiKey}&query=${country.capital}`)
      .then((response) => {
        console.log('Weatherstack response:', response.data);
        setWeatherData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
        setWeatherData(null);
      });
  };

  return (
    <div className="App">
      <h1>Country Information</h1>
      <input
        type="text"
        placeholder="Search for a country"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="country-info">
        {countryData && countryData.length === 1 ? (
          <div>
            <h2>{countryData[0].name.common}</h2>
            <p>Capital: {countryData[0].capital}</p>
            <p>Area: {countryData[0].area} square kilometers</p>
            <p>Languages: {Object.values(countryData[0].languages).join(', ')}</p>
            <img src={countryData[0].flags.png} alt={`${countryData[0].name.common} Flag`} width="200" />
          </div>
        ) : countryData && countryData.length > 1 ? (
          <ul>
            {countryData.map((country) => (
              <li key={country.cca3}>
                {country.name.common}{' '}
                <button onClick={() => showCountryDetails(country)}>View</button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {selectedCountry && (
        <div className="selected-country">
          <h2>{selectedCountry.name.common}</h2>
          <p>Capital: {selectedCountry.capital}</p>
          <p>Area: {selectedCountry.area} square kilometers</p>
          <p>Languages: {Object.values(selectedCountry.languages).join(', ')}</p>
          <img src={selectedCountry.flags.png} alt={`${selectedCountry.name.common} Flag`} width="200" />

          {weatherData && (
            <div>
              <h3>Weather in {selectedCountry.capital}</h3>
              <p>Temperature: {weatherData.current.temperature}°C</p>
              <p>Humidity: {weatherData.current.humidity}%</p>
              <p>Weather: {weatherData.current.weather_descriptions.join(', ')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
