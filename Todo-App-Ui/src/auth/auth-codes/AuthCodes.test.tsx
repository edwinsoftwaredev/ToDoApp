import React from 'react';
import {act, render, waitFor} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import * as AuthCodesExp from './AuthCodes';
import {Provider} from 'react-redux';
import Store from '../../store/Store';
import {AuthService} from '../AuthService';
import AuthCodes from "./AuthCodes";

describe('AuthCodes tests', () => {

  const store = Store.getInstance();
  let saveUserSpy: jest.SpyInstance<any>;

  beforeEach(() => {
    saveUserSpy = jest.spyOn(AuthCodesExp, 'saveUser')
  });

  afterEach(() => {
    saveUserSpy.mockRestore();
  });

  test('should render', () => {
    const authService = AuthService.getInstance();
    let completeAuthenticationSpy = jest.spyOn(authService, 'completeAuthentication');
    completeAuthenticationSpy.mockImplementation(() => Promise.resolve());
    render(
      <Provider store={store}>
        <MemoryRouter>
          <AuthCodes />
        </MemoryRouter>
      </Provider>
    );
  });
  
  test('should not call saveUser if completeAuthentication is resolved to void', async () => {
    const authService = AuthService.getInstance();
    let completeAuthenticationSpy = jest.spyOn(authService, 'completeAuthentication');
    completeAuthenticationSpy.mockImplementation(() => Promise.resolve());

    act(() => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <AuthCodes />
          </MemoryRouter>
        </Provider>
      );
    });

    await waitFor(() => {
      expect(AuthCodesExp.saveUser).not.toHaveBeenCalled();
    });
  });

  test('should call completeAuthentication', async () => {
    const authService = AuthService.getInstance();
    let completeAuthenticationSpy = jest.spyOn(authService, 'completeAuthentication');
    completeAuthenticationSpy.mockImplementation(() => Promise.resolve());
    
    act(() => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <AuthCodes />
          </MemoryRouter>
        </Provider>
      );
    });
    
    await waitFor(() => {
      expect(completeAuthenticationSpy).toHaveBeenCalledTimes(1);
    });
  });
});
