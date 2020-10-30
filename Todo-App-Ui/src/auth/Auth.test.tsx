import React from 'react';
import {AuthService} from './AuthService';
import {render} from '@testing-library/react';
import Auth from './Auth';
import {MemoryRouter} from 'react-router-dom';
import * as AuthCodes from "./auth-codes/AuthCodes";

describe('Auth component', () => {
  let connectingAuthorizationServerSpy: jest.SpyInstance<any>;
  let startAuthentication: jest.SpyInstance<any>;
  let spyAuthCodes: jest.SpyInstance;
  const authService = AuthService.getInstance();

  beforeEach(() => {
    connectingAuthorizationServerSpy = jest.spyOn(AuthService, 'NotAuthenticated');
    startAuthentication = jest.spyOn(authService, 'startAuthentication');
    spyAuthCodes = jest.spyOn(AuthCodes, 'default');
    
    spyAuthCodes.mockImplementation(() => {
      return (<div></div>);
    });
  });

  afterEach(() => {
    connectingAuthorizationServerSpy.mockClear();
    startAuthentication.mockClear();
    spyAuthCodes.mockRestore();
  });

  test('should not start authentication when path not auth/codes', () => {
    const url = '/auth/codes';

    render(
      <MemoryRouter initialEntries={[url]}>
        <Auth />
      </MemoryRouter>
    );

    expect(startAuthentication).not.toHaveBeenCalled();
    expect(connectingAuthorizationServerSpy).not.toHaveBeenCalled();
  });

  test('should start authentication when path is other than auth/codes', () => {
    const url = '/completed-todos';

    render(
      <MemoryRouter initialEntries={[url]}>
        <Auth />
      </MemoryRouter>
    );

    expect(startAuthentication).toHaveBeenCalledTimes(1);
    expect(connectingAuthorizationServerSpy).toHaveBeenCalledTimes(1);
  });
});
