import React from 'react';
import {Switch, Route} from 'react-router-dom';
import SignIn from './sign-in/SignIn';
import SignUp from './sign-up/SignUp';
import {AuthService} from './AuthService';
import {useQuery} from '../shared/utils';

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
    <Switch>
      <Route path="/signin" children={<SignInComponent />} />
      <Route path="/signup">
        <SignUp />
      </Route>
    </Switch>
  );
}

export default Auth;
