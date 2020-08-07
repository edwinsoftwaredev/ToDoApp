import React, {useEffect} from 'react';
import {
  Link, useLocation,
} from 'react-router-dom';
import {startAuthentication} from '../Auth';

const useQuery = (): URLSearchParams => {
  return new URLSearchParams(useLocation().search);
}

const checkUrlQuery = (returnUrlString: string | null): boolean => {

  if (!returnUrlString) return false;

  const returnUrlSearch =
    returnUrlString ? new URLSearchParams(new URL(returnUrlString as string).search) : null;

  const hasQuery: boolean =
    returnUrlString &&
      returnUrlSearch?.get('client_id') &&
      returnUrlSearch?.get('redirect_uri') &&
      returnUrlSearch?.get('response_mode') &&
      returnUrlSearch?.get('scope') &&
      returnUrlSearch?.get('state') &&
      returnUrlSearch?.get('code_challenge') &&
      returnUrlSearch?.get('code_challenge_method') &&
      returnUrlSearch?.get('response_mode') ? true : false;

  return hasQuery;

};

const SignIn: React.FC = (): JSX.Element => {

  const isValidUrlQuery: boolean = checkUrlQuery(useQuery().get('returnUrl'));

  useEffect(() => {
    if (!isValidUrlQuery) {
      startAuthentication();
    }
  }, [isValidUrlQuery]);

  const signInValid: JSX.Element = (
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

  return isValidUrlQuery ? signInValid : (<div><h3>Connecting to authorization server...</h3></div>);
}

export default SignIn;
