import React from 'react';
import {SignoutResponse, User as OidcUser, UserManager, UserManagerSettings} from 'oidc-client';
import {AxiosError} from 'axios';
import {RootState} from '../reducers/RootReducer';
import {createSelector} from '@reduxjs/toolkit';

export class AuthService {
  private static _instance: AuthService;
  private readonly _userManager: UserManager;

  private constructor() {
    const userManagerSettings: UserManagerSettings = {
      authority: process.env.REACT_APP_AUTH_SERVER_URL,
      client_id: 'TodoAppFirstPartyUser',
      redirect_uri: process.env.REACT_APP_REDIRECT_URI,
      response_type: 'code',
      scope: 'openid profile TodoAppApi.TodoAppUser',
      post_logout_redirect_uri: process.env.REACT_APP_POST_REDIRECT_LOGOUT
    };

    this._userManager = new UserManager(userManagerSettings);
  }

  getUser(): Promise<OidcUser | null> {
    return this._userManager.getUser();
  }

  /**
   * returns a singleton instance of AuthService
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
          AuthService.redirectLogNetErrorAuthService(error.message);
        }
      });
  }

  /**
   * processes auth tokens and return the Authenticated User
   */
  async completeAuthentication(): Promise<OidcUser | void> {
    return this._userManager.signinRedirectCallback();
  }

  startSignOut = async (): Promise<SignoutResponse | void> => {
    return this._userManager.signoutRedirect();
  };

  completeSignOut = async (): Promise<SignoutResponse> => {
    return this._userManager.signoutRedirectCallback();
  };

  public static isUserLoggedInSelector = createSelector(
    (state: RootState) => state.oidcUser,
    (oidcUser: OidcUser | {}) => {
      const isEmpty = (oidcUser: OidcUser | {}): boolean => {
        return Object.keys(oidcUser).length === 0;
      };

      return !isEmpty(oidcUser) && !(oidcUser as OidcUser).expired;
    }
  );

  /**
   * This function redirects and logs an error when the auth server was not reached.
   * When this function is called while tests are running a error is going to be logged.
   * That error does not mean that the test failed.
   */
  private static redirectLogNetErrorAuthService(error: string) {
    console.log(error);
  }
  
  public static NotAuthenticated(): JSX.Element {
    return (
      <div><h3>You are not logged in.<br />😅</h3></div>
    );
  }

  public static ConnectingAuthorizationServer(): JSX.Element {
    return (
      <div><h3>Connecting to authorization server...</h3></div>
    );
  }
}
