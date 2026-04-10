import "./App.css";
import { useState, useEffect, use } from "react";

function App() {
  const API_KEY = "65c22fe11ff8afe1d40eb7c55aa77063";
  const [weatherData, setWeatherdata] = useState(null);
  const [city, setcity] = useState("kyiv");
  const [forecast, setForecast] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeatherData = async (cityName) => {
    setcity(cityName);
    try {
      setLoading(true);
      setError(null);
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();
      setWeatherdata(data);

      const forecastresponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const forecastdata = await forecastresponse.json();
      const dailyforecast = forecastdata.list.filter(
        (item, index) => index % 8 === 0
      );
      setForecast(dailyforecast);
    } catch (error) {
      setError("Couldnt fetch data,please try again");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  function handleSearch(e) {
    e.preventDefault();
    fetchWeatherData(searchInput);
  }
  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);
  if (loading) return <div className="wrapper">Loading...</div>;

  return (
    <div className="wraper">
      <form onSubmit={handleSearch} className="searchform">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="searchinput"
        ></input>
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {weatherData && weatherData.main && weatherData.weather && (
        <>
          <div className="header">
            <h1 className="city">{weatherData.name}</h1>
            <p className="temp">{weatherData.main.temp}°C</p>
            <p className="condition">{weatherData.weather[0].main}</p>
          </div>
          <div className="details">
            <div className="">
              <p> Humidity</p>
              <p style={{ fontWeight: "bold" }}>
                {Math.round(weatherData.main.humidity)}%
              </p>
            </div>
            <div className="">
              <p>Wind Speed</p>
              <p style={{ fontWeight: "bold" }}>
                {Math.round(weatherData.wind.speed)}mph
              </p>
            </div>
          </div>
          {forecast.length > 0 && (
            <>
              <div className="forecast">
                <h2 className="forecats-hader"> 5-D Forecast</h2>
                <div className="all_days">
                  {forecast.map((day, index) => (
                    <div key={index} className="day">
                      <p>
                        {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                          weekday: "short",
                        })}
                      </p>
                      <img
                        src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                        alt={day.weather[0].description}
                      />
                      <p>{Math.round(day.main.temp)}°C</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
