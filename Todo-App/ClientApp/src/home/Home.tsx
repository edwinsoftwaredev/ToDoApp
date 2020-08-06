import React from 'react';
import logo from '../logo.svg';
import {useSelector} from 'react-redux';
import {RootState} from '../reducers/RootReducer';

const Home: React.FC = (): JSX.Element => {
  return (
    <div>
      <h2>{useSelector((state: RootState) => state.app.appName)}</h2>
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
    </div>
  );
}

export default Home;
