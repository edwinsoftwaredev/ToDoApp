import React from 'react';
import SignUp, * as SignUpUtils from './SignUp';
import {render, screen, fireEvent} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {AuthService} from '../AuthService';
import {AccountService} from '../AccountService';

describe('SignUp Component', () => {
  let spyStartAuthentication: jest.SpyInstance<Promise<void>>;
  let spyAccountService: jest.SpyInstance<any>;
  const authService: AuthService = AuthService.getInstance();

  beforeEach(() => {
    spyStartAuthentication = jest.spyOn(authService, 'startAuthentication');
    spyAccountService = jest.spyOn(AccountService, 'registerUser');
  });

  afterEach(() => {
    spyStartAuthentication.mockClear();
    spyAccountService.mockClear();
  });

  test('should render', () => {
    const signUpSpy = jest.spyOn(SignUpUtils, 'default');
    render(<MemoryRouter><SignUp /></MemoryRouter>);
    expect(signUpSpy).toHaveBeenCalledTimes(1);
  });

  test('should have a Sign Up button', () => {
    render(<MemoryRouter><SignUp /></MemoryRouter>);
    expect(screen.getByRole('button', {name: 'Sign Up'})).toBeTruthy();
  });

  test('should startAuthentication when submitted (after user has been store in backend)', () => {
    render(<MemoryRouter><SignUp /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', {name: 'Sign Up'}));
    spyAccountService.mockImplementation((userObj: object): Promise<void> => {
      return Promise.resolve();
    });
    expect(spyAccountService).toHaveBeenCalledTimes(1);
    spyAccountService.mockResolvedValueOnce(() => {
      expect(spyStartAuthentication).not.toHaveBeenCalledTimes(1);
    });
  });
});
