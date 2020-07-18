import { TestBed } from '@angular/core/testing';
import { LandingGuard } from './landing.guard';
import {AuthService} from '../auth/auth.service';

describe('LandingGuard', () => {
  let guard: LandingGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const routeMock: any = { snapshot: {} };
  const routeStateMock: any = { snapshot: {}, url: ''};
  const routerMock = {navigate: jasmine.createSpy('navigate')};

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['startAuthentication', 'isLoggedIn']);

    TestBed.configureTestingModule({
      providers: [
        {provide: AuthService, useValue: spy}
      ]
    });

    guard = TestBed.inject(LandingGuard);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  /**
   * should be authenticated to activate component
   * So, the guard has to return true if user is authenticated or
   * it has to return false in any other case.
   *
   * To test this funcionality a MOCK or SPY must be created and used just to be sure
   * that this function works as expected. Further functionality like the REAL redirection
   * to the signin page, wich means that the canActivate method has to return false and
   * execute the redirection, must be tested in a e2e test enviroment.
   *
   * Remember, unit testing only tests the functionality of the code required
   * for other parts of the application to act as a UNIT OF WORK or as the APP as a WHOLE,
   * which involve: connectivity with other services like REST API, databases and more,
   * in which case integration testing or e2e is required.
   *
   * check this: https://dzone.com/articles/unit-testing-guidelines-what-to-test-and-what-not
   * and this: https://medium.com/@lawrey/unit-tests-ui-tests-integration-tests-end-to-end-tests-c0d98e0218a6
   */
  it('should not activate. user is not logged in', () => {
    const stubValueIsLoggedIn = false;
    authServiceSpy.isLoggedIn.and.returnValue(stubValueIsLoggedIn); // this return a spy not a value!!
    expect(guard.canActivate(routeMock, routeStateMock)).toBe(stubValueIsLoggedIn);
    expect(authServiceSpy.startAuthentication).toHaveBeenCalled();
  });

  it('should activate. user is logged in', () => {
    const stubValueIsLoggedIn = true;
    authServiceSpy.isLoggedIn.and.returnValue(stubValueIsLoggedIn); // this return a spy not a value!!
    expect(guard.canActivate(routeMock, routeStateMock)).toBe(stubValueIsLoggedIn);
    expect(authServiceSpy.startAuthentication).not.toHaveBeenCalled();
  });

});
