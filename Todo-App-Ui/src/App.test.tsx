import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import App from './App';
import Store from './store/Store';
import {Provider} from 'react-redux';
import {AuthService} from './auth/AuthService';
import {createSelector} from '@reduxjs/toolkit';
import {RootState} from './reducers/RootReducer';
import * as  Home from './home/Home';
import {MemoryRouter} from 'react-router-dom';

const store = Store.getInstance();

describe('App Component', () => {
  let homeComponentSpy: jest.SpyInstance<any>;
  let notAuthenticatedComponentSpy: jest.SpyInstance<any>;
  
  beforeEach(() => {
    notAuthenticatedComponentSpy = jest.spyOn(AuthService, 'NotAuthenticated')
    homeComponentSpy = jest.spyOn(Home, 'default');
  });

  afterEach(() => {
    notAuthenticatedComponentSpy.mockRestore();
    homeComponentSpy.mockRestore();
  });


  test('should not render guarded route. User is not authenticated', async () => {
    const mockedIsUserLoggedIn = false;
    const authService: AuthService = AuthService.getInstance();
    const startAuthenticationSpy = jest.spyOn(authService, 'startAuthentication');
    // isUserLoggedInSpy recives a createSelector instance
    // mockImplementation argument is a function
    // that is why the previus function is executed
    let isUserLoggedInSpy = jest.spyOn(AuthService, 'isUserLoggedInSelector');
    isUserLoggedInSpy.mockImplementation((() => {
      return createSelector(
        (state: RootState) => state,
        () => mockedIsUserLoggedIn
      );
    })());

    let getUserSpy = jest.spyOn(authService, 'getUser');
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

    await waitFor(() => {    
      expect(getUserSpy).toHaveBeenCalledTimes(1);
      expect(isUserLoggedInSpy).toHaveBeenCalled();
      expect(startAuthenticationSpy).toHaveBeenCalledTimes(1);
      expect(homeComponentSpy).not.toHaveBeenCalled();
      expect(notAuthenticatedComponentSpy).toHaveBeenCalledTimes(1);
    });
  });
  
  test('should render guarded route. User is authenticated', async () => {
    homeComponentSpy.mockImplementation(() => (<div></div>));
    const mockedIsUserLoggedIn = true;
    const authService: AuthService = AuthService.getInstance();
    const startAuthenticationSpy = jest.spyOn(authService, 'startAuthentication');
    let getUserSpy = jest.spyOn(authService, 'getUser');
    let isUserLoggedInSpy = jest.spyOn(AuthService, 'isUserLoggedInSelector');

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

    await waitFor(() => {
      expect(getUserSpy).not.toHaveBeenCalled();
      expect(isUserLoggedInSpy).toHaveBeenCalled();
      expect(startAuthenticationSpy).not.toHaveBeenCalled();
      expect(homeComponentSpy).toHaveBeenCalled();
      expect(notAuthenticatedComponentSpy).not.toHaveBeenCalled();
    });
  });
});
