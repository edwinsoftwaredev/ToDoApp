import React from 'react';
import {AuthService} from './AuthService'

describe('Auth Service', () => {
  
  beforeAll(() => {
  });

  afterEach(() => {
  });
  
  test('should not return true when returnUrl is not valid', () => {
    const result = AuthService.isSignInAuthorizationUrl('?mockparam=value');
    expect(result).toBeFalsy();
  });
  
  test('should return true when returnUrl is valid', () => {
    const returnUrl =
      'path?client_id=mock&' +
      'redirect_uri=mock&' +
      'response_mode=mock&' +
      'scope=mock&' +
      'state=mock&' +
      'code_challenge=mock&' +
      'code_challenge_method=mock&' +
      'response_mode=mock';

    const result = AuthService.isSignInAuthorizationUrl(returnUrl);
    
    expect(result).toBeTruthy();
  });
});
