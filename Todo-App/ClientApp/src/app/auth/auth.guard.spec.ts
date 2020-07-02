import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import {AuthService} from './auth.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  const routeMock: any = { snapshot: {} };
  const routeStateMock: any = { snapshot: {}, url: ''};
  const routerMock = {navigate: jasmine.createSpy('navigate')};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService],
      imports: [HttpClientTestingModule]
    });
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  /**
   * shouldn't be authenticated to activate component
   * So, the guard has to return true if user isn't authenticated or
   * it has to return false in any other case
   */
  it('should return the same value as auth service isLoggedIn return value', () => {
    const isLoggedIn = authService.isLoggedIn();
    expect(guard.canActivate(routeMock, routeStateMock)).toEqual(isLoggedIn);
  });
});
