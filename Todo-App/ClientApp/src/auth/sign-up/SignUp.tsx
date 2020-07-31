import React from 'react';
import {
  Link
} from 'react-router-dom';

export default class SignUp extends React.Component {
  render() {
    return (
      <div>
        <p>sign-up works!</p>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/signin">Sign In</Link>
              </li>
              <li>
                <Link to="/">Home</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    );
  }
}
