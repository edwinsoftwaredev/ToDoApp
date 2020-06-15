import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isUserSignIn = false;

  constructor() { }

  get isUserSignIn(): boolean {
    return this._isUserSignIn;
  }

  /**
   * This function determines if the user is authenticated.
   * @param force if false we directly return the user already authenticated
   */
  identifyUser(force?: boolean): Promise<User> {
    if (!force) {

    }
  }
}
