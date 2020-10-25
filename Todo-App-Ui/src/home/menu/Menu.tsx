import React, {useState} from 'react';
import './Menu.scss';
import {AuthService} from '../../auth/AuthService';
import WeatherWidget from '../weather-widget/WeatherWidget';
import {useLocation, useHistory} from 'react-router-dom';

const MenuList = (props: any): JSX.Element => {
  const [signingOut, setSigningOut] = useState(false);
  const authService = AuthService.getInstance();

  const location = useLocation();

  const handleTargetSelection = (route?: string) => {
    setSigningOut(false);
    return route ? props.handleRoute(route) : null;
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    await authService.startSignOut();
  };

  return (
    <nav className={'smart-screen-list'}>
      <ol>
        <li
          className={(location.pathname === '/' && !signingOut ? ' selected' : '')}
          onClick={() => handleTargetSelection('/')}
        >
          <div><i className='bx bxs-bookmark-star bx-md'></i></div>
          <div className='title'>Featured Todos</div>
        </li>
        <li
          className={(location.pathname === '/todos' && !signingOut ? ' selected' : '')}
          onClick={() => handleTargetSelection('/todos')}
        >
          <div><i className='bx bx-notepad bx-md'></i></div>
          <div className='title'>Todos</div>
        </li>
        <li
          className={(location.pathname === '/completed-todos' && !signingOut ? ' selected' : '')}
          onClick={() => handleTargetSelection('/completed-todos')}
        >
          <div><i className='bx bx-calendar-check bx-md'></i></div>
          <div className='title'>Completed Todos</div>
        </li>
        <li
          className={(location.pathname === '/account' && !signingOut ? ' selected' : '')}
          onClick={() => handleTargetSelection('/account')}
        >
          <div><i className='bx bxs-user-detail bx-md'></i></div>
          <div className='title'>Account</div>
        </li>
        <li
          className={(signingOut ? ' selected' : '')}
          onClick={() => handleSignOut()}
        >
          <div><i className='bx bx-log-out bx-md'></i></div>
          <div className='title'>Sign Out</div>
        </li>
      </ol>
    </nav>
  );
};

const Menu: React.FC<any> = (): JSX.Element => {
  const history = useHistory();
  const handleRoute = (route: string) => {
    history.push(route);
  };

  return (
    <div className={'Menu'}>
      <section className='side-menu-section'>
        <div className={'smart-screen-weather-widget'}>
          <WeatherWidget />
        </div>
        <MenuList handleRoute={handleRoute} />
      </section>
    </div>
  );
};

export default Menu;
