import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {
    //
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.checkAuthentication(state.url);
  }

  /**
   * if user is not authenticated return true, so the component canActivate
   * @param url: the url to redirect
   */
  private checkAuthentication(url: string): boolean {
    if (!this.authService.isLoggedIn()) {
      return false;
    }

    return true;
  }
}
