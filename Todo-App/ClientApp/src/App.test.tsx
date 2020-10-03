import React from 'react';
import {render, screen, wait} from '@testing-library/react';
import App from './App';
import Store from './store/Store';
import {Provider} from 'react-redux';
import {AuthService} from './auth/AuthService';
import {createSelector} from '@reduxjs/toolkit';
import {RootState} from './reducers/RootReducer';
import * as  Home from './home/Home';
import {MemoryRouter} from 'react-router-dom';
import {AccountService} from './auth/AccountService';

const store = Store.getInstance();

describe('App Component', () => {

  let startAuthenticationSpy: jest.SpyInstance<Promise<void>>;
  let isUserLoggedInSpy: jest.SpyInstance<any>;
  let homeComponentSpy: jest.SpyInstance<any>;
  let notAuthenticatedComponentSpy: jest.SpyInstance<any>;
  let getAntiForgeryTokenSpy: jest.SpyInstance<any>;
  let getUserSpy: jest.SpyInstance<any>;

  const authService: AuthService = AuthService.getInstance();

  beforeEach(() => {
    startAuthenticationSpy = jest.spyOn(authService, 'startAuthentication');
    isUserLoggedInSpy = jest.spyOn(AuthService, 'isUserLoggedInSelector');
    notAuthenticatedComponentSpy = jest.spyOn(AuthService, 'NotAuthenticated')
    homeComponentSpy = jest.spyOn(Home, 'default');
    getAntiForgeryTokenSpy = jest.spyOn(AccountService, 'getAntiForgeryToken');
    getUserSpy = jest.spyOn(authService, 'getUser');
  });

  afterEach(() => {
    isUserLoggedInSpy.mockClear();
    startAuthenticationSpy.mockClear();
    notAuthenticatedComponentSpy.mockClear();
    getAntiForgeryTokenSpy.mockClear();
    getUserSpy.mockClear();
  });

  test('should get antiforgery token', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(getAntiForgeryTokenSpy).toHaveBeenCalledTimes(1);
  });

  test('should not render guarded route. User is not authenticated', async () => {
    const mockedIsUserLoggedIn = false;

    // isUserLoggedInSpy recives a createSelector instance
    // mockImplementation argument is a function
    // that is why the previus function is executed
    isUserLoggedInSpy.mockImplementation((() => {
      return createSelector(
        (state: RootState) => state,
        () => mockedIsUserLoggedIn
      );
    })());

    getAntiForgeryTokenSpy.mockImplementation(() => {
      return Promise.resolve();
    });

    getUserSpy.mockImplementation(() => {
      return Promise.resolve<null>(null);
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    // notice that I am not using ' instead I am using /
    // / is use to matching a regex
    // ' is use to matching a string
    // expect(screen.getByText(/You are not logged in./i)).toBeInTheDocument();

    await wait(() => {}); // just waiting for the other functions to be called
    expect(getUserSpy).toHaveBeenCalledTimes(1);
    expect(isUserLoggedInSpy).toHaveBeenCalled(); // the call is outside the useEffect
    expect(startAuthenticationSpy).toHaveBeenCalledTimes(1);
    expect(homeComponentSpy).not.toHaveBeenCalled();
    expect(notAuthenticatedComponentSpy).toHaveBeenCalledTimes(1);
  });

  test('should render guarded route. User is authenticated', async () => {
    const mockedIsUserLoggedIn = true;

    isUserLoggedInSpy.mockImplementation((() => {
      return createSelector(
        (state: RootState) => state,
        () => mockedIsUserLoggedIn
      );
    })());

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    await wait(() => {});
    expect(getUserSpy).not.toHaveBeenCalled();
    expect(isUserLoggedInSpy).toHaveBeenCalled(); // the call is outside the useEffect
    expect(startAuthenticationSpy).not.toHaveBeenCalled();
    expect(homeComponentSpy).toHaveBeenCalled();
    expect(notAuthenticatedComponentSpy).not.toHaveBeenCalled();
  });
});
