import React from 'react';
import {
  Link
} from 'react-router-dom';

const SignUp: React.FC = (): JSX.Element => {
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

export default SignUp;
