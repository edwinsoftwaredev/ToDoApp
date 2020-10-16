import React from 'react';
import './Home.scss';
import Menu from './menu/Menu';
import FeatureSection from './feature-section/FeatureSection';
import TodosList from './todos-list/TodosList';
import {Switch, Route} from 'react-router-dom';
import Axios, {AxiosError, AxiosResponse} from 'axios';
import {useDispatch} from 'react-redux';
import {saveWeather} from './weather-widget/WeatherWidget';

const Home: React.FC = (): JSX.Element => {
  const dispatch = useDispatch();

  // getting weather in startup
  navigator.geolocation.getCurrentPosition((position: Position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiUrl = process.env.REACT_APP_API_WEATHER_KEY;
    Axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiUrl}`)
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
                <FeatureSection />
              </div>
            </Route>
            <Route exact path="/todos">
              <div className='option-container'>
                <TodosList />
              </div>
            </Route>
            <Route exact path="/calendar">
              <div className='option-container'></div>
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
