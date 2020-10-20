import React from 'react';
import {Switch, Route, useLocation} from 'react-router-dom';
import SignIn from './sign-in/SignIn';
import SignUp from './sign-up/SignUp';
import {AuthService} from './AuthService';
import {useQuery} from '../shared/utils';
import './Auth.scss';
import AuthCodes from './auth-codes/AuthCodes';
import SignOut from './sign-out/SignOut';

/*
 * returns SignIn if the url is valid otherwise ConnectingAuthorizationServer
 **/
const SignInComponent: React.FC = (): JSX.Element => {
  const isValidUrl = AuthService.isSignInAuthorizationUrl(useQuery().get('returnUrl'));
  const ConnectingAuthorizationServer = AuthService.ConnectingAuthorizationServer;
  const authService = AuthService.getInstance();

  if (!isValidUrl) authService.startAuthentication();


  return isValidUrl ? <SignIn /> : <ConnectingAuthorizationServer />;
}

const Auth: React.FC = (): JSX.Element => {
  const authService = AuthService.getInstance();
  const location = useLocation();
  const isNotAnyPath = (location.pathname !== "/authentication/signin" &&
    location.pathname !== "/auth/codes" &&
    location.pathname !== "/authentication/signout" &&
    location.pathname !== "/authentication/signup");

  const handleAuthPathRedirection = (): JSX.Element => {
    authService.startAuthentication();
    return AuthService.NotAuthenticated();
  }

  return (
    <div className='Auth'>
      <header><h1 className='title'>Todo App</h1></header>
      {
        isNotAnyPath ? handleAuthPathRedirection() : null
      }
      <Switch>
        <Route exact path="/authentication/signin" children={<SignInComponent />} />
        <Route exact path="/authentication/signup">
          <SignUp />
        </Route>
        <Route exact path='/auth/codes'>
          <AuthCodes />
        </Route>
        <Route exact path='/authentication/signout'>
          <SignOut />
        </Route>
      </Switch>
    </div>
  );
}

export default Auth;
