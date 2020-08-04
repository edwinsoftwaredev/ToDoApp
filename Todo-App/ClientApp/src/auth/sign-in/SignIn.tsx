import React from 'react';
import {
  Link,
} from 'react-router-dom';

const SignIn = () => {
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

export default SignIn;
