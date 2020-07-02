import { Injectable } from '@angular/core';
import {UserManager, UserManagerSettings, User as OidcUser, Profile} from 'oidc-client';
import {SERVER_API_URL, REDIRECT_URI, REDIRECT_LOGOUT} from '../shared/app-constants';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user: OidcUser = null;

  private _userManagerSettings: UserManagerSettings = {
    authority: SERVER_API_URL,
    client_id: 'TodoAppFirstPartyUser',
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'TodoAppUser OpenId Profile',
    post_logout_redirect_uri: REDIRECT_LOGOUT
  };

  get User(): OidcUser {
    return this._user;
  }

  private _userManager: UserManager = new UserManager(this._userManagerSettings);

  constructor() {
    this.identifyUser();
  }

  /**
   * This function determines if the user is authenticated or logged in.
   * @param force: if false we directly return the user already authenticated
   */
  isLoggedIn(): boolean {
    return this._user != null && !this._user.expired;
  }

  /**
   * Return the Oidc user instance profile
   */
  getClaims(): Profile {
    return this._user.profile;
  }

  /**
   * this function return the token with its type.
   * this could be used to make api request
   */
  getAuthorizationHeaderValue(): string {
    return `${this._user.token_type} ${this._user.access_token}`;
  }

  /**
   * Redirect to the authorization endpoint
   */
  startAuthentication(): Promise<void> {
    return this._userManager.signinRedirect()
      .catch((error: HttpErrorResponse) => {
        if (error.message === 'Network Error') {
          //
        }
      });
  }

  /**
   * Process the signin callback
   */
  async completeAuthentication(): Promise<void> {
    const user = await this._userManager.signinRedirectCallback();
    this._user = user;
  }

  private identifyUser(): void {
    this._userManager.getUser().then((user: OidcUser) => {
      this._user = user;
    });
  }
}
