import React from 'react';
import logo from '../logo.svg';
import {
  Link
} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {RootState} from '../reducers/RootReducer';

const Home: React.FC = (): JSX.Element => {
  const appName = useSelector((state: RootState) => state.app.appName);

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
      <div>
        <h5>{appName}</h5>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/signin">Sign In</Link>
          </li>
          <li>
            <Link to="/signup">Sign Up</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Home;
