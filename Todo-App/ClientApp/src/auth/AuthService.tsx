import React, {useEffect} from 'react';
import {UserManagerSettings, UserManager, User as OidcUser} from 'oidc-client';
import {AxiosError} from 'axios';
import {RootState} from '../reducers/RootReducer';
import {createSelector} from '@reduxjs/toolkit';
import {Route} from 'react-router-dom';
import {useSelector} from 'react-redux';

export class AuthService {
  private static _instance: AuthService;
  private _userManager: UserManager;

  private constructor() {
    const userManagerSettings: UserManagerSettings = {
      authority: process.env.REACT_APP_API_SERVER_URL,
      client_id: 'TodoAppFirstPartyUser',
      redirect_uri: process.env.REACT_APP_REDIRECT_URI,
      response_type: 'code',
      scope: 'openid profile TodoAppApi.TodoAppUser',
      popup_redirect_uri: process.env.REACT_APP_REDIRECT_LOGOUT
    };

    this._userManager = new UserManager(userManagerSettings);
  }

  get UserManager(): UserManager {
    return this._userManager;
  }

  getUser(): Promise<OidcUser | null> {
    return this._userManager.getUser();
  }

  /**
   * returns an singleton instance of AuthService
   */
  public static getInstance(): AuthService {
    if (this._instance) return this._instance;

    this._instance = new AuthService();
    return this._instance;
  }

  /**
   * Redirects to the authorization endpoint
   */
  async startAuthentication(): Promise<void> {
    return this._userManager.signinRedirect()
      .catch((error: AxiosError) => {
        if (error.message === 'Network Error') {
          this.redirectLogNetErrorAuthService(error.message);
        }
      });
  }

  public static isUserLoggedInSelector = createSelector(
    (state: RootState) => state.oidcUser,
    (oidcUser: OidcUser | {}) => {
      const isEmpty = (oidcUser: OidcUser | {}): boolean => {
        return Object.keys(oidcUser).length !== 0 ? false : true;
      };

      return !isEmpty(oidcUser) && !(oidcUser as OidcUser).expired;
    }
  );

  /**
   * This function redirects and logs when auth server was not reach.
   * When this function is called while tests are running a error is going to be logged.
   * That error does not mean that the a test may fail.
   */
  private redirectLogNetErrorAuthService(error: string) {
    console.log(error);
  }

  /*
   * Guards a route based on user authentication state
   */
  public privateRoute({children, ...rest}: any): JSX.Element {
    const guardedRoute = (
      <Route {...rest} render={() => (children)} />
    );

    // useSelector is a Hook and in StrictMode it is called twice. In fact is not the hook which
    // is called twice but the reducer wrapped by the hook.
    // This is the normal behavior of React in developement mode, which helps the developer to
    // check if there is an unexpected side effect.
    // To avoid unexpected side effects the reducer must be pure <-- just values not calculated values.
    const isUserLoggedIn: boolean = useSelector(AuthService.isUserLoggedInSelector);

    useEffect(() => {
      if (!isUserLoggedIn) {
        // _instance in static in this class and
        // privateRoute is in this class
        // that is why it is possible to use this line of code
        AuthService._instance.startAuthentication();
      }
    }, [isUserLoggedIn]);

    return isUserLoggedIn ? guardedRoute : (<div><h3>You are not logged in.<br />😅</h3></div>);
  };
}
