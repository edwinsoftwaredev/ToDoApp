import React from 'react';

export class AuthService {
  private static _instance: AuthService;

  private constructor() {
  }

  /**
   * returns a singleton instance of AuthService
   */
  public static getInstance(): AuthService {
    if (this._instance) return this._instance;

    this._instance = new AuthService();
    return this._instance;
  }

  /*
   * returns true if the argument is a valid signin url
   **/
  public static isSignInAuthorizationUrl(returnUrlString: string | null): boolean {

    if (!returnUrlString) return false;

    const returnUrlSearch =
      returnUrlString ? new URLSearchParams(returnUrlString.split('?')[1]) : null;
    
    return !!(returnUrlString &&
        returnUrlSearch?.get('client_id') &&
        returnUrlSearch?.get('redirect_uri') &&
        returnUrlSearch?.get('response_mode') &&
        returnUrlSearch?.get('scope') &&
        returnUrlSearch?.get('state') &&
        returnUrlSearch?.get('code_challenge') &&
        returnUrlSearch?.get('code_challenge_method') &&
        returnUrlSearch?.get('response_mode'));

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
  
  public static InvalidUrl(): JSX.Element {
    return (
      <div>
        <h3>Invalid Url...</h3>
      </div>
    )
  }
}
