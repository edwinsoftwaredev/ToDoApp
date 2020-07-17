import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import {AuthService} from './auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const routeMock: any = { snapshot: {} };
  const routeStateMock: any = { snapshot: {}, url: ''};
  const routerMock = {navigate: jasmine.createSpy('navigate')};

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);

    TestBed.configureTestingModule({
      providers: [
        {provide: AuthService, useValue: spy}
      ]
    });
    guard = TestBed.inject(AuthGuard);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  /**
   * shouldn't be authenticated to activate component
   * So, the guard has to return true if user isn't authenticated or
   * it has to return false in any other case
   */
  it('should not activate. user is not logged in', () => {
    const stubValueIsLoggedIn = false;
    authServiceSpy.isLoggedIn.and.returnValue(stubValueIsLoggedIn); // this return a spy not a value!!
    expect(guard.canActivate(routeMock, routeStateMock)).not.toBe(stubValueIsLoggedIn);
  });

  it('should activate. user is logged in', () => {
    const stubValueIsLoggedIn = true;
    authServiceSpy.isLoggedIn.and.returnValue(stubValueIsLoggedIn); // this return a spy not a value!!
    expect(guard.canActivate(routeMock, routeStateMock)).not.toBe(stubValueIsLoggedIn);
  });
});
