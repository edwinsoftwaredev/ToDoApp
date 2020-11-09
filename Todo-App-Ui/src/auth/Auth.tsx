import React, {useState, useEffect, useRef} from 'react';
import {Switch, Route, useLocation} from 'react-router-dom';
import {AuthService} from './AuthService';
import './Auth.scss';
import AuthCodes from './auth-codes/AuthCodes';
import Axios, {AxiosResponse} from 'axios';

const Auth: React.FC = (): JSX.Element => {
  const authService = AuthService.getInstance();
  const location = useLocation();
  const isAuthCodesPath = location.pathname !== "/auth/codes";
  const [authServerAlive, setAuthServerAlive] = useState(false);
  const intervalId = useRef<number>(0);

  const handleAuthPathRedirection = (): JSX.Element => {
    return AuthService.NotAuthenticated();
  }

  const checkIfAlive = () => {
    Axios.get(`${process.env.REACT_APP_AUTH_SERVER_URL}/.well-known/openid-configuration`)
      .then((response: AxiosResponse) => {
        if (response.status === 200) {
          setAuthServerAlive(true);
        }
      });
  };

  useEffect(() => {
    if (!authServerAlive) {
      intervalId.current = window.setInterval(checkIfAlive, 1000);
    }

    return () => {
      window.clearInterval(intervalId.current);
    };
  }, [authServerAlive]);

  useEffect(() => {
    if (authServerAlive) {
      window.clearInterval(intervalId.current);
      authService.startAuthentication();
    }

    return () => {
      window.clearInterval(intervalId.current);
    };
  }, [authServerAlive, authService]);

  return (
    <div className='Auth'>
      <header><h1 className='title'>Todo App</h1></header>
      {
        isAuthCodesPath ? handleAuthPathRedirection() : null
      }
      <Switch>
        <Route exact path='/auth/codes'>
          <AuthCodes />
        </Route>
      </Switch>
    </div>
  );
}

export default Auth;
