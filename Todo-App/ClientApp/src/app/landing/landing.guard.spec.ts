import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import { LandingGuard } from './landing.guard';
import {AuthService} from '../auth/auth.service';

describe('LandingGuard', () => {
  let guard: LandingGuard;
  let authService: AuthService;
  const routeMock: any = { snapshot: {} };
  const routeStateMock: any = { snapshot: {}, url: ''};
  const routerMock = {navigate: jasmine.createSpy('navigate')};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService],
      imports: [HttpClientTestingModule]
    });
    guard = TestBed.inject(LandingGuard);
    authService = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  /**
   * should be authenticated to activate component
   * So, the guard has to return true if user is authenticated or
   * it has to return false in any other case
   */
  it('should return the same value as auth service isLoggedIn return value', () => {
    const isLoggedIn = authService.isLoggedIn();
    expect(guard.canActivate(routeMock, routeStateMock)).toEqual(isLoggedIn);
  });

});
