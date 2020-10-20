import React from 'react';
import './Home.scss';
import Menu from './menu/Menu';
import {Switch, Route} from 'react-router-dom';
import FeaturedTodos from './featured-todos/FeaturedTodos';
import Todos from './todos/Todos';
import Axios, {AxiosError, AxiosResponse} from 'axios';
import {useDispatch} from 'react-redux';
import {saveWeather} from './weather-widget/WeatherWidget';
import CompletedTodos from './completed-todos/CompletedTodos';

const Home: React.FC = (): JSX.Element => {
  const dispatch = useDispatch();

  // getting weather in startup
  navigator.geolocation.getCurrentPosition((position: Position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiKey = process.env.REACT_APP_API_WEATHER_KEY;
    Axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
      .then((response: AxiosResponse) => {
        dispatch(saveWeather({
          weatherDescription: response.data.weather[0].description,
          weatherTemperature: response.data.main.temp,
          weatherIcon: response.data.weather[0].icon
        }));
      }).catch((error: AxiosError) => {
        console.log(error.message);
      });
  }, ((posError: PositionError) => {
    console.log(posError);
  }), {enableHighAccuracy: true} as PositionOptions);

  return (
    <div className={'Home'}>
      <Menu />
      <div className='container'>
        <main className='home-main'>
          <Switch>
            <Route exact path="/">
              <div className='option-container'>
                <FeaturedTodos />
              </div>
            </Route>
            <Route exact path="/todos">
              <div className='option-container'>
                <Todos />
              </div>
            </Route>
            <Route exact path="/completed-todos">
              <div className='option-container'>
                <CompletedTodos />
              </div>
            </Route>
            <Route exact path="/account">
              <div className='option-container'></div>
            </Route>
          </Switch>
        </main>
      </div>
    </div>
  );
}

export default Home;
