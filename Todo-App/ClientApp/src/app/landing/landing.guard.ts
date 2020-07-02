import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LandingGuard implements CanActivate {

  constructor(private authService: AuthService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.checkAuthentication(state.url);
  }

  /**
   * here we check if user is authenticated if not
   * then it is redirected to the authentication endpoint.
   * @param url: the url to redirected after successful signin
   */
  private checkAuthentication(url: string): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    this.authService.startAuthentication();

    return false;
  }
}
