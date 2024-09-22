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
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
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
      if (!city) return;

      const apiKey = 'a7de75f8cd9fd84efe436943aa953e5c';
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
          setErrorMessage(null);
        })
        .catch((error) => {
          console.error('Error fetching weather data:', error);
          setErrorMessage('Failed to fetch weather data for the specified city.');
        });
    };

    fetchWeatherData();
  }, [city]);

  useEffect(() => {
    const fetchUserWeatherData = () => {
      if (!userLocation) return;

      const apiKey = 'a7de75f8cd9fd84efe436943aa953e5c';
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
          setErrorMessage(null);
        })
        .catch((error) => {
          console.error('Error fetching weather data for location:', error);
          setErrorMessage('Failed to fetch weather data for your location.');
        });
    };

    fetchUserWeatherData();
  }, [userLocation]);

  const handleSearch = () => {
    if (searchQuery) {
      setCity(searchQuery);
    }
  };

  // Toggle part
  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  return (
    <main className='flex flex-col items-center justify-center w-full max-w-screen-lg gap-4 p-4 mx-auto border border-black shadow-lg h-fit bg-bgClr-0 text-tetClr-0'>
      <div className='flex flex-row items-center justify-center w-full max-w-md gap-3 p-1 border-2 border-otherClr-0 h-fit text-tetClr-0 bg-bgClr-0 rounded-xl'>
        <input
          type="search"
          id='search-bar'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='w-full h-8 pl-1 text-sm border-none rounded-sm outline-none bg-bgClr-0 font-pryFont placeholder:text-otherClr-0'
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

      {/* Tailwind CSS Toggle */}
      <div className='flex items-center space-x-2'>
        <div
          className={`w-10 h-6 flex items-center bg-bgClr-0 rounded-full p-1 cursor-pointer ${isToggled ? 'border border-borderClr-0' : 'border border-borderClr-0'}`}
          onClick={handleToggle}
        >
          <div
            className={`bg-borderClr-0 w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${isToggled ? 'translate-x-4' : ''}`}
          ></div>
        </div>
        <span className='text-tetClr-0 font-pryFont'>
          {isToggled ? 'Off' : 'On'}
        </span>
      </div>

      {/* Error Message */}
      {errorMessage && <p className="font-bold text-red-500">{errorMessage}</p>}

      {/* Area for the weather data */}
      {isToggled ? (
        weatherData.city && (
          <article className='grid grid-cols-2 gap-4 text-center font-pryFont'>
            <div className="flex items-center justify-center col-span-2 gap-2 text-3xl font-bold text-center text-borderClr-0"><FaMapPin /> {weatherData.city}</div>
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
