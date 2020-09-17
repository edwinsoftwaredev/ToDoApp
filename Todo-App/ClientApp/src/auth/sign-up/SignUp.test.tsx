import React from 'react';
import SignUp, * as SignUpUtils from './SignUp';
import {render, screen, fireEvent} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {AuthService} from '../AuthService';
import * as Email from '../../shared/inputs/user/email/Email';
import * as Name from '../../shared/inputs/user/name/Name';
import * as Password from '../../shared/inputs/user/password/Password';
import * as Username from '../../shared/inputs/user/username/Username';

describe('SignUp Component', () => {
  let spyStartAuthentication: jest.SpyInstance<Promise<void>>;
  const authService: AuthService = AuthService.getInstance();
  let spyEmail = jest.spyOn(Email, 'default');
  let spyName = jest.spyOn(Name, 'default');
  let spyPassword = jest.spyOn(Password, 'default');
  let spyUsername = jest.spyOn(Username, 'default');

  beforeEach(() => {
    jest.resetModules();
    spyStartAuthentication = jest.spyOn(authService, 'startAuthentication');
  });

  afterEach(() => {
    spyStartAuthentication.mockClear();
    spyEmail.mockClear();
    spyUsername.mockClear();
    spyName.mockClear();
    spyPassword.mockClear();
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

  test('should implement User form fields', () => {
    const {container} = render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    const inputs = container.getElementsByClassName('uk-input') as HTMLCollectionOf<HTMLInputElement>;

    expect(inputs.length).toBe(4);

    expect(spyEmail).toHaveBeenCalledTimes(1);
    expect(spyName).toHaveBeenCalledTimes(1);
    expect(spyPassword).toHaveBeenCalledTimes(1);
    expect(spyUsername).toHaveBeenCalledTimes(1);
  });
});
