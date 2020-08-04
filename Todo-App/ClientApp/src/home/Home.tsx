import React from 'react';
import {
  Link
} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {RootState} from '../store/Store';

const Home = (): JSX.Element => {
  const appName = useSelector((state: RootState) => state.appName);

  return (
    <div>
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
