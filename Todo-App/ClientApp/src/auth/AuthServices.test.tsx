import React from 'react';
import {AuthService} from './AuthService';
import {RootState} from '../reducers/RootReducer';
import {createSelector} from '@reduxjs/toolkit';
import {render, screen} from '@testing-library/react';
import Store from '../store/Store';
import {Provider} from 'react-redux';
import {Switch, MemoryRouter} from 'react-router-dom';

describe('Auth Service', () => {
  let notAuthenticatedComponentSpy: jest.SpyInstance<any>;
  let isUserLoggedInSpy: jest.SpyInstance<any>;
  const authService = AuthService.getInstance();
  const store = Store.getInstance();


  beforeAll(() => {
    notAuthenticatedComponentSpy = jest.spyOn(AuthService, 'NotAuthenticated');
    isUserLoggedInSpy = jest.spyOn(AuthService, 'isUserLoggedInSelector');
  });

  afterEach(() => {
    notAuthenticatedComponentSpy.mockClear();
    isUserLoggedInSpy.mockClear();
  });

  test('should return NotAuthenticated component. user is not authenticated.', () => {
    const mockedIsUserLoggedIn = false;

    isUserLoggedInSpy.mockImplementation((() => {
      return createSelector(
        (state: RootState) => state,
        () => mockedIsUserLoggedIn
      );
    })());

    const PrivateRoute = authService.privateRoute;

    // defining the type of the function is required when typescript is used
    // this way jest returns the JSX.Element instead of the type of jest.fn()
    // this enables this component to be used
    const ChildComponentMock: () => JSX.Element = jest.fn((): JSX.Element => {
      return (<div>x</div>);
    });

    const MainComponentMock = (): JSX.Element => {
      return (
        <MemoryRouter initialEntries={['/']}>
          <Switch>
            <PrivateRoute exact path='/'>
              <ChildComponentMock />
            </PrivateRoute>
          </Switch>
        </MemoryRouter>
      );
    };

    render(
      <Provider store={store}>
        <MainComponentMock />
      </Provider>
    );

    expect(isUserLoggedInSpy).toHaveBeenCalledTimes(2);
    expect(ChildComponentMock).not.toHaveBeenCalled();
    expect(notAuthenticatedComponentSpy).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/x/i)).toBeNull();
  });

  test('should not return NotAuthenticated component. user is authenticated.', () => {
    const mockedIsUserLoggedIn = true;

    isUserLoggedInSpy.mockImplementation((() => {
      return createSelector(
        (state: RootState) => state,
        () => mockedIsUserLoggedIn
      );
    })());

    const PrivateRoute = authService.privateRoute;
    // defining the type of the function is required when typescript is used
    // this way jest returns the JSX.Element instead of the type of jest.fn()
    // this enables this component to be used
    const ChildComponentMock: () => JSX.Element = jest.fn((): JSX.Element => {
      return (<div>x</div>);
    });

    const MainComponentMock = (): JSX.Element => {
      return (
        <MemoryRouter initialEntries={['/']}>
          <Switch>
            <PrivateRoute exact path='/'>
              <ChildComponentMock />
            </PrivateRoute>
          </Switch>
        </MemoryRouter>
      );
    };

    render(
      <Provider store={store}>
        <MainComponentMock />
      </Provider>
    );

    expect(isUserLoggedInSpy).toHaveBeenCalledTimes(2);
    expect(notAuthenticatedComponentSpy).not.toHaveBeenCalled();
    expect(ChildComponentMock).toHaveBeenCalled();
    expect(screen.getByText(/x/i)).toBeInTheDocument();
  });
});
