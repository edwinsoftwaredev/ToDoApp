import React from 'react';
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

const Home: React.FC = (): JSX.Element => {
  const authService = AuthService.getInstance();

  const handleLogout = () => {
    // first delete auth cookie, the startSignOut from IdentityServer
    AccountService.deleteAuthCookie().then(() => {
      authService.startSignOut();
    });
  };

  return (
    <div className='home-component'>
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
    </div>
  );
}

export default Home;
