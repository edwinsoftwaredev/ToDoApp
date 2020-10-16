import React, {useState, useRef, useEffect} from 'react';
import './WeatherWidget.scss';
import Axios, {AxiosResponse, AxiosError} from 'axios';
import {Slice, createSlice, PayloadAction, Action, createSelector} from '@reduxjs/toolkit';
import {ActionsObservable, StateObservable, ofType} from 'redux-observable';
import {RootState} from '../../reducers/RootReducer';
import {map} from 'rxjs/operators';
import {useDispatch, useSelector} from 'react-redux';

/////////////////////////////////////////////////////////////////////////////////////////////

export interface IWeather {
  weatherDescription: string,
  weatherTemperature: string
  weatherIcon: string
}

const initialWeatherState: IWeather = {
  weatherDescription: '',
  weatherTemperature: '0',
  weatherIcon: ''
};

export const weatherSlice: Slice<IWeather> = createSlice({
  name: 'weather',
  initialState: initialWeatherState,
  reducers: {
    setWeather: (state: IWeather, action: PayloadAction<IWeather>) => {
      state = action.payload;
      return state;
    }
  }
});

////////////////////////////////////////////////////////////////////////////////////////////

enum ActionTypes {
  SAVE_WEATHER = 'weather/setWeather',
}

export const saveWeather = (weather: IWeather) => ({type: ActionTypes.SAVE_WEATHER, payload: weather});

interface ISaveWeather extends Action {
  type: ActionTypes.SAVE_WEATHER,
  weather: IWeather
}

export const weatherEpic = (
  action$: ActionsObservable<ISaveWeather>,
  state$: StateObservable<RootState>
) => action$.pipe(
  ofType<ISaveWeather>(ActionTypes.SAVE_WEATHER),
  map((weatherAction: ISaveWeather) => {
    state$.value.weather = weatherAction.weather;
  }),
);

export type SaveWeatherAction = ISaveWeather;

////////////////////////////////////////////////////////////////////////////////////////////

const rain: string[] = [
  'light rain',
  'moderate rain',
  'heavy intensity rain',
  'very heavy rain',
  'extreme rain',
  'freezing rain',
  'light intensity shower rain',
  'heavy intensity shower rain',
  'ragged shower rain'
];

const snow: string[] = [
  'light snow',
  'Heavy snow',
  'Sleet',
  'Light shower sleet',
  'Shower sleet',
  'Light rain and snow',
  'Rain and snow',
  'Light shower snow',
  'Shower snow',
  'Heavy shower snow'
];

const atmosphere: string[] = [
  'Smoke',
  'Haze',
  'sand/ dust whirls',
  'fog',
  'sand',
  'dust',
  'volcanic ash',
  'squalls',
  'tornado'
];

const clouds: string[] = [
  'few clouds',
  'overcast clouds'
];

/////////////////////////////////////////////////////////////////////////////////////////

const weatherSelector = createSelector(
  (state: RootState) => state.weather,
  (weather: IWeather) => weather
);

////////////////////////////////////////////////////////////////////////////////////////

const WeatherWidget: React.FC<any> = () => {
  const [weatherBgClass, setWeatherBgClass] = useState<string>('clear-sky-d');

  const date = new Date().toString().split(' ');
  let actualDate = date[2];
  let grade = 'th';
  if (actualDate.includes('1', 1)) {
    grade = 'st';
  }
  if (actualDate.includes('1', 1)) {
    grade = 'nd';
  }
  if (actualDate.includes('1', 1)) {
    grade = 'rd';
  }
  actualDate = (actualDate[0] === '0' ? actualDate[1] : actualDate);

  const weather = useSelector(weatherSelector);

  useEffect(() => {
    if (weather.weatherDescription) {
      let wbgclass = '';
      let description = weather.weatherDescription;

      if (rain.includes(description)) {
        description = 'rain';
      }

      if (snow.includes(description)) {
        description = 'snow';
      }

      if (atmosphere.includes(description)) {
        description = 'mist';
      }

      if (clouds.includes(description)) {
        description = 'scattered clouds';
      }

      wbgclass = description.replace(' ', '-');
      wbgclass =
        weather.weatherIcon.includes('d') ? wbgclass + '-d' : wbgclass + '-n';
      setWeatherBgClass(wbgclass);
    }
  }, [weather]);

  return (
    <div className='WeatherWidget'>
      <div className='date-picture-weather-container'>
        <div className='date-picture-weather'>
          <div className={'widgets-container ' + weatherBgClass}>
            <div className='day-date'>
              {date[0] + ', ' + actualDate + grade}
            </div>
            <div className='month-year'>
              {date[1] + ', ' + date[3]}
            </div>
            <div className='weather-status'>
              {weather.weatherDescription}
            </div>
            <div className='weather-stat'>
              {Number.isNaN(Math.round(Number.parseFloat(weather.weatherTemperature as string))) ? '' : Math.round(Number.parseFloat(weather.weatherTemperature as string)) + '°F'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
