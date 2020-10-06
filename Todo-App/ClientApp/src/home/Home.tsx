import React, {useState, useEffect} from 'react';
import logo from '../logo.svg';
import {useSelector} from 'react-redux';
import {RootState} from '../reducers/RootReducer';
import './Home.scss';
import {AuthService} from '../auth/AuthService';
import {AccountService} from '../auth/AccountService';
/**
 * this component contains the code requiered to logout,
 * that doesn't mean it has to be placed here.
 */
const MenuList = (props: any): JSX.Element => {
  const [prevTarget, setPrevTarget] = useState();
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
    <nav>
      <ol>
        <li
          onClick={event => handleTargetSelection(event.currentTarget, 'feature')}
        >
          <div><i className='bx bxs-bookmark-star bx-md'></i></div>
          <div>Featured Todos</div>
        </li>
        <li
          onClick={event => handleTargetSelection(event.currentTarget, 'calendar')}
        >
          <div><i className='bx bx-calendar-check bx-md'></i></div>
          <div>Calendar</div>
        </li>
        <li
          onClick={event => handleTargetSelection(event.currentTarget, 'account')}
        >
          <div><i className='bx bxs-user-detail bx-md'></i></div>
          <div>Account</div>
        </li>
        <li
          onClick={event => handleTargetSelection(event.currentTarget, 'signout')}
        >
          <div><i className='bx bx-log-out bx-md'></i></div>
          <div>Sign Out</div>
        </li>
      </ol>
    </nav>
  );
};

const SideMenu: React.FC = () => {
  const handleRoute = (route: string) => {
  };

  return (
    <div className='SideMenu'>
      <section className='side-menu-section'>
        <div className='title-bar'>
          <div className='title'>
            <span>Todos Manager</span>
          </div>
          <div className='btn-menu-shrink'>
            <button className={'uk-button uk-button-default'}>
              <i className='bx bx-arrow-from-right bx-md'></i>
            </button>
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
    <div className='Home'>
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
