import { useEffect, useState } from 'react'
import axios from 'axios'


const Filter = ({ setFilterStringCallback }) => {

  const [filterString, setFilterString] = useState('')


  const handleChange = (event) => {
    setFilterString(event.target.value)
    setFilterStringCallback(event.target.value)
  }

  return (
    <div>
      find countries: <input
        value={filterString}
        onChange={handleChange} />
    </div>
  )

}

const WeatherInfo = ({ country }) => {

  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const [lat, lon] = country.latlng
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=hourly,daily&appid=${process.env.REACT_APP_API_KEY}`
    
    axios.get(url).then(resp => {
      setWeather(resp.data)
    })
  }, [])
  

  if (weather) {

    const iconUrl = `http://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`
    return (
      <div>
        <h2>Current weather in {country.name.common}</h2>
        <p>temperature: {weather.current.temp}C</p>
        <img src={iconUrl}></img>
        <p>wind {weather.current.wind_speed} m/s</p>
      </div>

    )
  }


  return (<div></div>)
}


const CountryInfo = ({ country }) => {

  return (
    <div>
      <h1>{country.name.common}</h1>

      <b>Capital:</b> <p>{country.capital[0]}</p>
      <b>Area:</b> <p>{country.area} km2</p>

      <h3>Languages</h3>
      <ul>
        {Object.values(country.languages).map(lang => <li key={lang}> {lang} </li>)}
      </ul>

      <img src={country.flags.png}></img>
      
      <WeatherInfo country={country} />
    </div>
  )
}

const CountryEntry = ({ country, selectCountryCallback }) => {

  const handleClick = () => selectCountryCallback(country)

  return (
    <div>
      <p > {country.name.common}</p>
      <button onClick={handleClick}>Show</button>
    </div>
  )
}


const App = () => {
  const [countries, setCountries] = useState([])
  const [visibleCountries, setVisibleCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      });
  }, [])



  const filterCallback = (filterString) => {
    const newVisibleCountries = countries.filter(country =>
      country.name.common.toLowerCase().includes(filterString.toLowerCase()))

    if (newVisibleCountries.length === 1) {
      setSelectedCountry(newVisibleCountries[0])
    } else {
      setSelectedCountry(null)
    }

    setVisibleCountries(newVisibleCountries)
  }

  const selectCountryCallback = country => setSelectedCountry(country)


  console.log(process.env.REACT_APP_API_KEY)

  if (selectedCountry) {
    console.log(selectedCountry)
    return (
      <div>
        <Filter setFilterStringCallback={filterCallback} />
        <CountryInfo country={selectedCountry} />
      </div>
    )
  }


  return (
    <div>
      <Filter setFilterStringCallback={filterCallback} />

      {visibleCountries.length > 10 &&
        <p>Too many matches, specify another filter</p>
      }

      {visibleCountries.length <= 10 &&
        visibleCountries.map(country =>
          <CountryEntry
            key={country.name.official}
            country={country}
            selectCountryCallback={selectCountryCallback} />
        )
      }

    </div>
  )
}

export default App