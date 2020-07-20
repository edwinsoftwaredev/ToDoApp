import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';

import {AuthService} from './auth.service';
jest.mock('./auth.service');

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceMock: jest.Mocked<AuthService>;

  const routeMock: any = { snapshot: {} };
  const routeStateMock: any = { snapshot: {}, url: ''};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
    guard = TestBed.inject(AuthGuard);
    authServiceMock = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
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
    authServiceMock.isLoggedIn.mockReturnValue(mockedIsUserLoggedIn);
    expect(guard.canActivate(routeMock, routeStateMock)).not.toBe(mockedIsUserLoggedIn);
  });

  it('should activate. user is logged in', () => {
    const mockedIsUserLoggedIn = true;
    authServiceMock.isLoggedIn.mockReturnValue(mockedIsUserLoggedIn);
    expect(guard.canActivate(routeMock, routeStateMock)).not.toBe(mockedIsUserLoggedIn);
  });
});
