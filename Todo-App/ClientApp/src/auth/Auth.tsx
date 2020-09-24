import React from 'react';
import {Switch, Route} from 'react-router-dom';
import SignIn from './sign-in/SignIn';
import SignUp from './sign-up/SignUp';
import {AuthService} from './AuthService';
import {useQuery} from '../shared/utils';
import './Auth.scss';
import AuthCodes from './auth-codes/AuthCodes';

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
  return (
    <div className='Auth'>
      <header><h1 className='title'>TaskMan</h1></header>
      <Switch>
        <Route path="/signin" children={<SignInComponent />} />
        <Route exact path="/signup">
          <SignUp />
        </Route>
        <Route path='/auth/codes'>
          <AuthCodes />
        </Route>
      </Switch>
    </div>
  );
}

export default Auth;
