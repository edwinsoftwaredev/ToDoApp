import React, {useState, useEffect} from 'react';
import './Menu.scss';
import {AuthService} from '../../auth/AuthService';
import {AccountService} from '../../auth/AccountService';
import WeatherWidget from '../weather-widget/WeatherWidget';

const MenuList = (props: any): JSX.Element => {
  const [prevTarget, setPrevTarget] = useState<HTMLLIElement>();
  const [selectedTarget, setSelectedTarget] = useState();
  const authService = AuthService.getInstance();

  const handleTargetSelection = (target: HTMLLIElement, route?: string) => {
    if (!prevTarget) {
      target.classList.add('selected');
      setPrevTarget(target);
      setSelectedTarget(target);
      return route ? props.handleRoute(route) : null;
    }

    setSelectedTarget(target);
    return route ? props.handleRoute(route) : null;
  };

  useEffect(() => {
    if (prevTarget !== selectedTarget) {
      (prevTarget as HTMLLIElement).classList.remove('selected');
      setPrevTarget(selectedTarget);
      (selectedTarget as HTMLLIElement).classList.add('selected');
    }
  }, [prevTarget, selectedTarget]);

  const handleSignOut = (target: HTMLLIElement) => {
    handleTargetSelection(target);
    // first delete auth cookie, the startSignOut from IdentityServer
    AccountService.deleteAuthCookie().then(() => {
      authService.startSignOut();
    });
  };

  return (
    <nav className={'smart-screen-list'}>
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
          onClick={event => handleSignOut(event.currentTarget)}
        >
          <div><i className='bx bx-log-out bx-md'></i></div>
          <div className='title'>Sign Out</div>
        </li>
      </ol>
    </nav>
  );
};

const Menu: React.FC<any> = (): JSX.Element => {
  const handleRoute = (route: string) => {
    console.log(route);
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
