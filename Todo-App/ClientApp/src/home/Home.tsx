import React, {useState, useEffect} from 'react';
import logo from '../logo.svg';
import {useSelector} from 'react-redux';
import {RootState} from '../reducers/RootReducer';
import './Home.scss';
import {AuthService} from '../auth/AuthService';
import {AccountService} from '../auth/AccountService';
import Axios, {AxiosResponse, AxiosError} from 'axios';
/**
 * this component contains the code requiered to logout,
 * that doesn't mean it has to be placed here.
 */
const MenuList = (props: any): JSX.Element => {
  const [prevTarget, setPrevTarget] = useState<HTMLLIElement>();
  const [selectedTarget, setSelectedTarget] = useState();

  const handleTargetSelection = (target: HTMLLIElement, route: string) => {
    if (!prevTarget) {
      target.classList.add('selected');
      setPrevTarget(target);
      setSelectedTarget(target);
      return props.handleRoute(route);
    }

    setSelectedTarget(target);
    return props.handleRoute(route);
  };

  useEffect(() => {
    if (prevTarget !== selectedTarget) {
      (prevTarget as HTMLLIElement).classList.remove('selected');
      setPrevTarget(selectedTarget);
      (selectedTarget as HTMLLIElement).classList.add('selected');
    }
  }, [prevTarget, selectedTarget]);

  return (
    <nav >
      <ol>
        <li
          onClick={event => handleTargetSelection(event.currentTarget, 'feature')}
        >
          <div><i className='bx bxs-bookmark-star bx-md'></i></div>
          <div className='title'>Featured Todos</div>
        </li>
        <li
          onClick={event => handleTargetSelection(event.currentTarget, 'calendar')}
        >
          <div><i className='bx bx-calendar-check bx-md'></i></div>
          <div className='title'>Calendar</div>
        </li>
        <li
          onClick={event => handleTargetSelection(event.currentTarget, 'account')}
        >
          <div><i className='bx bxs-user-detail bx-md'></i></div>
          <div className='title'>Account</div>
        </li>
        <li
          onClick={event => handleTargetSelection(event.currentTarget, 'signout')}
        >
          <div><i className='bx bx-log-out bx-md'></i></div>
          <div className='title'>Sign Out</div>
        </li>
      </ol>
    </nav>
  );
};

const SideMenu = (): JSX.Element => {
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
          console.log(error.message);
        });
    }

  }, ((posError: PositionError) => {
    console.log(posError);
  }), {enableHighAccuracy: true} as PositionOptions);

  const handleRoute = (route: string) => {
    console.log(route);
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

  return (
    <div className={'SideMenu'}>
      <section className='side-menu-section'>
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
                {Math.round(Number.parseFloat(weatherTemp as string))}F°
              </div>
            </div>
          </div>
        </div>
        <MenuList handleRoute={handleRoute} />
      </section>
    </div>
  );
};

const Home: React.FC = (): JSX.Element => {

  const authService = AuthService.getInstance();

  const handleLogout = () => {
    // first delete auth cookie, the startSignOut from IdentityServer
    AccountService.deleteAuthCookie().then(() => {
      authService.startSignOut();
    });
  };

  return (
    <div className={'Home'}>
      <SideMenu />
      <div className='container'>
        <main className='home-main'>
          <header>
            <h1 className='title'>
              {useSelector((state: RootState) => state.app.appName)}
            </h1>
          </header>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <br />
          <button
            className={'uk-button uk-button-default'}
            onClick={handleLogout}>
            Sign Out
          </button>
        </main>
      </div>
    </div>
  );
}

export default Home;
