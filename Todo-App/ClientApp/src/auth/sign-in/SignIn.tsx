import React from 'react';
import {
  Link,
} from 'react-router-dom';

export default class SignIn extends React.Component {
  render() {
    return (
      <div>
        <p>sign-in works!</p>

        <div>
          <nav>
            <ul>
              <li>
                <Link to="/signup">Sign Up</Link>
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

