import React from 'react';
import {Switch, Route, useLocation} from 'react-router-dom';
import {AuthService} from './AuthService';
import './Auth.scss';
import AuthCodes from './auth-codes/AuthCodes';

const Auth: React.FC = (): JSX.Element => {
  const authService = AuthService.getInstance();
  const location = useLocation();
  const isAuthCodesPath = location.pathname !== "/auth/codes";

  const handleAuthPathRedirection = (): JSX.Element => {
    authService.startAuthentication();
    return AuthService.NotAuthenticated();
  }

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
