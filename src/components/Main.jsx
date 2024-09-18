// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { FaSearch, FaMapPin } from 'react-icons/fa';
import axios from 'axios';

function Main() {
  const [isToggled, setIsToggled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState({
    city: '',
    temperature: '',
    time: '',
    description: '',
    images: '',
    wind_speed: '',
    relative_humidity: '',
    high_temp: '',
    low_temp: '',
  });

  const [userLocation, setUserLocation] = useState(null);
  const [userWeatherData, setUserWeatherData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null); // Renamed the state

  useEffect(() => {
    // Fetch user's geolocation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
      },
      (error) => {
        console.error('Error getting geolocation:', error.message);
        setErrorMessage('Unable to retrieve your location');
      }
    );
  }, []);

  useEffect(() => {
    const fetchWeatherData = () => {
      if (!city) return; // Only fetch data if a city is provided

      const apiKey = 'a7de75f8cd9fd84efe436943aa953e5c'; // Replace with your actual API key
      const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

      axios
        .get(apiUrl, {
          params: {
            q: city,
            appid: apiKey,
            units: 'metric',
          },
        })
        .then((response) => {
          const { name, main, weather, wind } = response.data;
          setWeatherData({
            city: name,
            temperature: main.temp,
            time: new Date().toLocaleDateString(),
            description: weather[0].description,
            images: weather[0].icon,
            wind_speed: wind.speed,
            relative_humidity: main.humidity,
            high_temp: main.temp_max,
            low_temp: main.temp_min,
          });
          setErrorMessage(null); // Clear any previous errors
        })
        .catch((error) => {
          console.error('Error fetching weather data:', error);
          setErrorMessage('Failed to fetch weather data for the specified city.');
        });
    };

    fetchWeatherData(); // Call the function to fetch data when `city` changes
  }, [city]);

  useEffect(() => {
    const fetchUserWeatherData = () => {
      if (!userLocation) return;

      const apiKey = 'a7de75f8cd9fd84efe436943aa953e5c'; // Replace with your actual API key
      const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

      axios
        .get(apiUrl, {
          params: {
            lat: userLocation.latitude,
            lon: userLocation.longitude,
            appid: apiKey,
            units: 'metric',
          },
        })
        .then((response) => {
          const { name, main, weather, wind } = response.data;
          setUserWeatherData({
            city: name,
            temperature: main.temp,
            time: new Date().toLocaleDateString(),
            description: weather[0].description,
            images: weather[0].icon,
            wind_speed: wind.speed,
            relative_humidity: main.humidity,
            high_temp: main.temp_max,
            low_temp: main.temp_min,
          });
          setErrorMessage(null); // Clear any previous errors
        })
        .catch((error) => {
          console.error('Error fetching weather data for location:', error);
          setErrorMessage('Failed to fetch weather data for your location.');
        });
    };

    fetchUserWeatherData(); // Call the function to fetch weather data based on geolocation
  }, [userLocation]);

  const handleSearch = () => {
    if (searchQuery) {
      setCity(searchQuery); // Set the city to trigger the useEffect hook
    }
  };

  // Toggle part
  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  return (
    <main className='flex flex-col items-center justify-center gap-4 p-4 mx-auto border border-black shadow-lg w-fit h-fit bg-bgClr-0 text-tetClr-0'>
      <div className='flex flex-row items-center justify-center gap-3 p-1 border-2 border-otherClr-0 w-fit h-fit text-tetClr-0 bg-bgClr-0 rounded-xl'>
        <input
          type="search"
          id='search-bar'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='h-8 pl-1 text-sm border-none rounded-sm outline-none bg-bgClr-0 w-80 font-pryFont placeholder:text-otherClr-0'
          placeholder='Search a city...'
        />
        <button
          id='search-btn'
          className='w-6 h-6 text-otherClr-0'
          onClick={handleSearch}
        >
          <FaSearch />
        </button>
      </div>

      {/* Toggle button */}
      <div>
        <label className='flex items-center space-x-2'>
          <input
            type="checkbox"
            checked={isToggled}
            onChange={handleToggle}
            className='w-3 h-3 border form-checkbox border-tetClr-0'
          />
          <span className='text-tetClr-0 font-pryFont'> Change tab </span>
        </label>
      </div>

      {/* Error Message */}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {/* Area for the weather data */}
      {isToggled ? (
        weatherData.city && (
          <article className='grid grid-cols-2 gap-4 text-center font-pryFont'>
            <div className="flex items-center justify-center col-span-2 gap-2 text-3xl font-bold text-center text-borderClr-0"><FaMapPin/> {weatherData.city}</div>
            <div className='text-xl font-bold'>{weatherData.temperature}°C</div>
            <div className='text-xl font-bold'>{weatherData.time}</div>
            <div className="col-span-2 capitalize">{weatherData.description}</div>
            <div className="flex items-center justify-center col-span-2 border-none">
              <img
                src={`http://openweathermap.org/img/wn/${weatherData.images}@2x.png`}
                alt={weatherData.description}
              />
            </div>
            <div>Wind Speed: {weatherData.wind_speed} m/s</div>
            <div>Humidity: {weatherData.relative_humidity}%</div>
            <div>High: {weatherData.high_temp}°C</div>
            <div>Low: {weatherData.low_temp}°C</div>
          </article>
        )
      ) : (
        userWeatherData && (
          <article className='grid grid-cols-2 gap-4 text-center font-pryFont'>
            <h1 className='col-span-2 text-xl font-bold'> User Location </h1>
            <div className="flex flex-row items-center justify-center col-span-2 gap-2 text-3xl font-bold text-center text-borderClr-0"><FaMapPin /> {userWeatherData.city}</div>
            <div className='text-xl font-bold'>{userWeatherData.temperature}°C</div>
            <div className='text-xl font-bold'>{userWeatherData.time}</div>
            <div className="col-span-2 capitalize">{userWeatherData.description}</div>
            <div className="flex items-center justify-center col-span-2 border-none">
              <img
                src={`http://openweathermap.org/img/wn/${userWeatherData.images}@2x.png`}
                alt={userWeatherData.description}
              />
            </div>
            <div>Wind Speed: {userWeatherData.wind_speed} m/s</div>
            <div>Humidity: {userWeatherData.relative_humidity}%</div>
            <div>High: {userWeatherData.high_temp}°C</div>
            <div>Low: {userWeatherData.low_temp}°C</div>
          </article>
        )
      )}

      <footer className='text-sm text-center text-tetClr-0 font-pryFont'>
        © 2024. Developed by {''}
        <a className='text-borderClr-0' target='_blank' rel='noreferrer' href='https://victor-dev-gamma.vercel.app/'>
          Victor Ememe
        </a>
      </footer>
    </main>
  );
}

export default Main;
