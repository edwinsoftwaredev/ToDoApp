import React from 'react';
import {render, screen} from '@testing-library/react';
import App from './App';
import Store from './store/Store';
import {Provider} from 'react-redux';
import {AuthService} from './auth/AuthService';
import {createSelector} from '@reduxjs/toolkit';
import {RootState} from './reducers/RootReducer';
import * as  Home from './home/Home';

const store = Store.getInstance();

describe('App Component', () => {

  let startAuthenticationSpy: jest.SpyInstance<Promise<void>>;
  let isUserLoggedInSpy: jest.SpyInstance<any>;
  let homeComponentSpy: jest.SpyInstance<any>;
  let notAuthenticatedComponentSpy: jest.SpyInstance<any>;

  const authService: AuthService = AuthService.getInstance();

  beforeEach(() => {
    startAuthenticationSpy = jest.spyOn(authService, 'startAuthentication');
    isUserLoggedInSpy = jest.spyOn(AuthService, 'isUserLoggedInSelector');
    notAuthenticatedComponentSpy = jest.spyOn(AuthService, 'NotAuthenticated')
    homeComponentSpy = jest.spyOn(Home, 'default');
  });

  afterEach(() => {
    isUserLoggedInSpy.mockClear();
    startAuthenticationSpy.mockClear();
    notAuthenticatedComponentSpy.mockClear();
  });

  test('should not render guarded route. User is not authenticated', () => {
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

    render(<Provider store={store}><App /></Provider>);
    // notice that I am not using ' instead I am using /
    // / is use to matching a regex
    // ' is use to matching a string
    // expect(screen.getByText(/You are not logged in./i)).toBeInTheDocument();
    expect(isUserLoggedInSpy).toHaveBeenCalledTimes(2); // the call is outside the useEffect
    expect(startAuthenticationSpy).toHaveBeenCalledTimes(1);
    expect(homeComponentSpy).not.toHaveBeenCalled();
    expect(notAuthenticatedComponentSpy).toHaveBeenCalledTimes(1);
  });

  test('should render guarded route. User is authenticated', () => {
    const mockedIsUserLoggedIn = true;

    isUserLoggedInSpy.mockImplementation((() => {
      return createSelector(
        (state: RootState) => state,
        () => mockedIsUserLoggedIn
      );
    })());

    render(<Provider store={store}><App /></Provider>);
    expect(isUserLoggedInSpy).toHaveBeenCalledTimes(2); // the call is outside the useEffect
    expect(startAuthenticationSpy).not.toHaveBeenCalled();
    expect(homeComponentSpy).toHaveBeenCalled();
    expect(notAuthenticatedComponentSpy).not.toHaveBeenCalled();
  });
});
