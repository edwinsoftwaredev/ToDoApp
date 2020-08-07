import React from 'react';
import {Switch, Route} from 'react-router-dom';
import SignIn from './sign-in/SignIn';
import SignUp from './sign-up/SignUp';
import {UserManagerSettings, UserManager, User} from 'oidc-client';
import {AxiosError} from 'axios';
import {createSelector} from '@reduxjs/toolkit';
import {RootState} from '../reducers/RootReducer';

const userManagerSettings: UserManagerSettings = {
  authority: process.env.REACT_APP_API_SERVER_URL,
  client_id: 'TodoAppFirstPartyUser',
  redirect_uri: process.env.REACT_APP_REDIRECT_URI,
  response_type: 'code',
  scope: 'openid profile TodoAppApi.TodoAppUser',
  popup_redirect_uri: process.env.REACT_APP_REDIRECT_LOGOUT
};

export const userManager: UserManager = new UserManager(userManagerSettings);

export const startAuthentication = async (): Promise<void> => {
  return userManager.signinRedirect()
    .catch((error: AxiosError) => {
      if (error.message === 'Network Error') {
        redirectLogNetErrorAuthService(error.message);
      }
    });
}

export const isUserLoggedInSelector = createSelector(
  (state: RootState) => state.oidcUser,
  (oidcUser: User | {}) => {
    const isEmpty = (oidcUser: User | {}): boolean => {
      return Object.keys(oidcUser).length !== 0 ? false : true;
    };

    return !isEmpty(oidcUser) && !(oidcUser as User).expired;
  }
);

/**
* This function redirects and logs when auth server is not reached.
* When this function is called while tests are running a error is going to be logged.
* That error doesn't mean that the a test may fail.
*/
const redirectLogNetErrorAuthService = (error: string) => {
  console.log(error);
}

const Auth: React.FC = (): JSX.Element => {
  return (
    <Switch>
      <Route path="/signin" children={<SignIn />} />
      <Route path="/signup">
        <SignUp />
      </Route>
    </Switch>
  );
}

export default Auth;
