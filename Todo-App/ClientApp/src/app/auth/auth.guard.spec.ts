import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';

import {AuthService} from './auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;

  const routeMock: any = { snapshot: {} };
  const routeStateMock: any = { snapshot: {}, url: ''};

  let isLoggedInSpy: jest.SpyInstance<boolean>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);

    isLoggedInSpy = jest.spyOn(authService, 'isLoggedIn');
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
    const mockedIsUserLoggedIn = false;
    isLoggedInSpy.mockReturnValue(mockedIsUserLoggedIn);
    expect(guard.canActivate(routeMock, routeStateMock)).not.toBe(mockedIsUserLoggedIn);
  });

  it('should activate. user is logged in', () => {
    const mockedIsUserLoggedIn = true;
    isLoggedInSpy.mockReturnValue(mockedIsUserLoggedIn);
    expect(guard.canActivate(routeMock, routeStateMock)).not.toBe(mockedIsUserLoggedIn);
  });
});
