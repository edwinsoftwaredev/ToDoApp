import React from 'react';
import * as SignIn from './sign-in/SignIn';
import {render} from '@testing-library/react';
import Auth from './Auth';
import {MemoryRouter} from 'react-router-dom';

describe('Auth component', () => {
  let signInSpy: jest.SpyInstance<any>;

  beforeEach(() => {
    signInSpy = jest.spyOn(SignIn, 'default');
  });

  afterEach(() => {
    signInSpy.mockClear();
  });

  test('should render SignIn. URL is valid', () => {
    const urlToEncode = 'https://localhost:5001/callback?client_id=T&redirect_uri=h&response_type=c&scope=o&state=f&code_challenge=E&code_challenge_method=S&response_mode=q';
    const url = '/authentication/signin?returnUrl=' + encodeURIComponent(urlToEncode);

    render(
      <MemoryRouter initialEntries={[url]}>
        <Auth />
      </MemoryRouter>
    );

    expect(signInSpy).toHaveBeenCalledTimes(1);
  });

  test('should not render SignIn. URL is not valid', () => {
    const urlToEncode = '';
    const url = '/authentication/signin?returnUrl=' + encodeURIComponent(urlToEncode);

    render(
      <MemoryRouter initialEntries={[url]}>
        <Auth />
      </MemoryRouter>
    );
    
    expect(signInSpy).not.toHaveBeenCalled();
  });
});
