import { TestBed } from '@angular/core/testing';
import { LandingGuard } from './landing.guard';

import {AuthService} from '../auth/auth.service';

describe('LandingGuard', () => {
  let guard: LandingGuard;
  let authService: AuthService;

  const routeMock: any = { snapshot: {} };
  const routeStateMock: any = { snapshot: {}, url: ''};
  let startAuthenticationSpy: jest.SpyInstance<Promise<void>>;
  let isLoggedInSpy: jest.SpyInstance<boolean>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });

    guard = TestBed.inject(LandingGuard);
    authService = TestBed.inject(AuthService);

    startAuthenticationSpy = jest.spyOn(authService, 'startAuthentication');
    isLoggedInSpy = jest.spyOn(authService, 'isLoggedIn');
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
    const mockedIsUserLoggedIn = false;
    isLoggedInSpy.mockReturnValue(mockedIsUserLoggedIn);
    expect(guard.canActivate(routeMock, routeStateMock)).toBe(mockedIsUserLoggedIn);
    expect(startAuthenticationSpy).toHaveBeenCalledTimes(1);
    startAuthenticationSpy.mockClear();
    isLoggedInSpy.mockClear();
  });

  it('should activate. user is logged in', () => {
    const mockedIsUserLoggedIn = true;
    isLoggedInSpy.mockReturnValue(mockedIsUserLoggedIn);
    expect(guard.canActivate(routeMock, routeStateMock)).toBe(mockedIsUserLoggedIn);
    expect(startAuthenticationSpy).not.toHaveBeenCalled();
    startAuthenticationSpy.mockClear();
    isLoggedInSpy.mockClear();
  });

  /**
   * This is an integration test. here I am spying if the startAuthentication method is called.
   * however I am no cheking if the oidc's signinRedirect method is called or testing its
   * functionality. For that I am using a e2e testing using puppeteer.
   * Also for testing a function with a promise as a return value a async test is needed.
   */
  it('should return a valid active state', () => {
    const isUserLoggedIn = authService.isLoggedIn();
    expect(guard.canActivate(routeMock, routeStateMock)).toBe(isUserLoggedIn);
    /**
     * here I am not checking if there is will be an error by calling startAuthentication.
     * That exception has to be handled by the guard or by the authService and thats the
     * method that has to be tested.
     * Here I am testing that that method is called just 1 time.
     */
    expect(startAuthenticationSpy).toHaveBeenCalledTimes(1);
    startAuthenticationSpy.mockClear();
  });
});
