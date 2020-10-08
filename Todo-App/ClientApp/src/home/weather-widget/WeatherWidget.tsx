import React, {useState} from 'react';
import './WeatherWidget.scss';
import Axios, {AxiosResponse, AxiosError} from 'axios';

const WeatherWidget: React.FC = () => {
  const [weatherDesc, setWeatherDesc] = useState<string>('');
  const [weatherTemp, setWeatherTemp] = useState<string>('0');
  const [weatherBgClass, setWeatherBgClass] = useState<string>('');

  const convertWeatherDesc = (response: AxiosResponse<any>) => {
    let wbgclass = '';
    let description = response.data.weather[0].description;
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
      response
        .data
        .weather[0]
        .icon
        .includes('d') ? wbgclass + '-d' : wbgclass + '-n';
    setWeatherBgClass(wbgclass);
  };

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
  actualDate = (actualDate.includes('0', 0) ? actualDate[1] : actualDate);

  navigator.geolocation.getCurrentPosition((position: Position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiUrl = process.env.REACT_APP_API_WEATHER_KEY;

    if (!weatherDesc) {
      Axios
        .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiUrl}`)
        .then((response: AxiosResponse) => {
          setWeatherDesc(response.data.weather[0].description);
          setWeatherTemp(response.data.main.temp);
          convertWeatherDesc(response);
        }).catch((error: AxiosError) => {
          setWeatherBgClass('clear-sky-d');
          setWeatherTemp('');
          setWeatherDesc('');
          console.log(error.message);
        });
    }

  }, ((posError: PositionError) => {
    console.log(posError);
    setWeatherBgClass('clear-sky-d');
    setWeatherTemp('');
    setWeatherDesc('');
  }), {enableHighAccuracy: true} as PositionOptions);

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
              {weatherDesc}
            </div>
            <div className='weather-stat'>
              {Number.isNaN(Math.round(Number.parseFloat(weatherTemp as string))) ? '' : Math.round(Number.parseFloat(weatherTemp as string)) + '°F'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
