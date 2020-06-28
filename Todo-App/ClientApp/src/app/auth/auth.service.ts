import { Injectable } from '@angular/core';
import {UserManager, UserManagerSettings, User as OidcUser} from 'oidc-client';
import {SERVER_API_URL, REDIRECT_URI, REDIRECT_LOGOUT} from '../shared/app-constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _userManager: UserManager;
  private _userManagerSettings: UserManagerSettings = {
      authority: SERVER_API_URL,
      client_id: 'TodoAppFirstPartyUser',
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: 'TodoAppUser OpenId Profile',
      post_logout_redirect_uri: REDIRECT_LOGOUT
  };

  constructor() {
      // UserManager requires a config object
      this._userManager = new UserManager(this._userManagerSettings);
  }

  /**
   * This function determines if the user is authenticated.
   * @param force: if false we directly return the user already authenticated
   */
  identifyUser(force?: boolean): Promise<OidcUser> {
    if (!force) {
        this._userManager.removeUser();
    }

    return this._userManager.getUser();
  }
}
