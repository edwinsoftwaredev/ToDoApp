import React from 'react';
import * as SignIn from './sign-in/SignIn';
import {AuthService} from './AuthService';
import {render} from '@testing-library/react';
import Auth from './Auth';
import {MemoryRouter} from 'react-router-dom';

describe('Auth component', () => {
  let signInSpy: jest.SpyInstance<any>;
  let connectingAuthorizationServerSpy: jest.SpyInstance<any>;
  let startAuthentication: jest.SpyInstance<any>;
  const authService = AuthService.getInstance();

  beforeEach(() => {
    signInSpy = jest.spyOn(SignIn, 'default');
    connectingAuthorizationServerSpy = jest.spyOn(AuthService, 'ConnectingAuthorizationServer');
    startAuthentication = jest.spyOn(authService, 'startAuthentication');
  });

  afterEach(() => {
    signInSpy.mockClear();
    connectingAuthorizationServerSpy.mockClear();
    startAuthentication.mockClear();
  });

  test('should render SignIn. URL is valid', () => {
    const urlToEncode = 'https://localhost:5001/callback?client_id=T&redirect_uri=h&response_type=c&scope=o&state=f&code_challenge=E&code_challenge_method=S&response_mode=q';
    const url = '/authentication/signin?returnUrl=' + encodeURIComponent(urlToEncode);

    render(
      <MemoryRouter initialEntries={[url]}>
        <Auth />
      </MemoryRouter>
    );

    expect(startAuthentication).not.toHaveBeenCalled();
    expect(signInSpy).toHaveBeenCalledTimes(1);
    expect(connectingAuthorizationServerSpy).not.toHaveBeenCalled();
  });

  test('should not render SignIn. URL is not valid', () => {
    const urlToEncode = '';
    const url = '/authentication/signin?returnUrl=' + encodeURIComponent(urlToEncode);

    render(
      <MemoryRouter initialEntries={[url]}>
        <Auth />
      </MemoryRouter>
    );

    expect(startAuthentication).toHaveBeenCalledTimes(1);
    expect(signInSpy).not.toHaveBeenCalled();
    expect(connectingAuthorizationServerSpy).toHaveBeenCalledTimes(1);
  });
});
