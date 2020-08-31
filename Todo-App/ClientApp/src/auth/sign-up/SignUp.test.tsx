import React from 'react';
import SignUp, * as SignUpUtils from './SignUp';
import {render, screen, fireEvent} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {AuthService} from '../AuthService';
import {AccountService} from '../AccountService';

describe('SignUp Component', () => {
  let spyStartAuthentication: jest.SpyInstance<Promise<void>>;
  let spyRegisterUser: jest.SpyInstance<any>;
  const authService: AuthService = AuthService.getInstance();

  beforeEach(() => {
    const mockFunc = (userObj: object): Promise<void> => {
      return Promise.resolve();
    };
    // To mock a static method it must be assigned to mock function
    // like next:
    AccountService.registerUser = mockFunc;

    spyStartAuthentication = jest.spyOn(authService, 'startAuthentication');
    spyRegisterUser = jest.spyOn(AccountService, 'registerUser');
  });

  afterEach(() => {
    spyStartAuthentication.mockClear();
    spyRegisterUser.mockClear();
  });

  test('should render', () => {
    const signUpSpy = jest.spyOn(SignUpUtils, 'default');
    render(<MemoryRouter><SignUp /></MemoryRouter>);
    expect(signUpSpy).toHaveBeenCalledTimes(1);
  });

  test('should have a Sign Up button', () => {
    render(<MemoryRouter><SignUp /></MemoryRouter>);
    expect(screen.getByRole('button', {name: 'Sign Up'})).toBeInTheDocument();
  });

  test('should startAuthentication when submitted (after user has been store in backend)', async () => {
    render(<MemoryRouter><SignUp /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', {name: 'Sign Up'}));
    await expect(spyRegisterUser).toHaveBeenCalledTimes(1);
    await expect(spyStartAuthentication).toHaveBeenCalledTimes(1);
  });
});
