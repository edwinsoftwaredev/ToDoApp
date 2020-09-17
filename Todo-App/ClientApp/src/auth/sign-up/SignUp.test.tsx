import React from 'react';
import SignUp, * as SignUpUtils from './SignUp';
import {render, screen, fireEvent} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {AuthService} from '../AuthService';
import * as Email from '../../shared/inputs/user/email/Email';
import * as Name from '../../shared/inputs/user/name/Name';
import * as Password from '../../shared/inputs/user/password/Password';
import * as Username from '../../shared/inputs/user/username/Username';
import {AccountService} from '../../auth/AccountService';

describe('SignUp Component', () => {
  let spyStartAuthentication: jest.SpyInstance<Promise<void>>;
  let spyRegisterUser: jest.SpyInstance<Promise<void>>;
  const authService: AuthService = AuthService.getInstance();
  let spyEmail = jest.spyOn(Email, 'default');
  let spyName = jest.spyOn(Name, 'default');
  let spyPassword = jest.spyOn(Password, 'default');
  let spyUsername = jest.spyOn(Username, 'default');

  beforeEach(() => {
    jest.resetModules();
    spyStartAuthentication = jest.spyOn(authService, 'startAuthentication');
    spyRegisterUser = jest.spyOn(AccountService, 'registerUser');
  });

  afterEach(() => {
    spyStartAuthentication.mockClear();
    spyRegisterUser.mockClear();
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

    const inputs = container
      .getElementsByTagName('input') as HTMLCollectionOf<HTMLInputElement>;

    expect(inputs.length).toBe(4);

    expect(spyEmail).toHaveBeenCalledTimes(1);
    expect(spyName).toHaveBeenCalledTimes(1);
    expect(spyPassword).toHaveBeenCalledTimes(1);
    expect(spyUsername).toHaveBeenCalledTimes(1);
  });

  test('should not submit if form is not valid', () => {
    const {container} = render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    const inputs = container
      .getElementsByTagName('input') as HTMLCollectionOf<HTMLInputElement>;

    fireEvent.change(
      inputs.namedItem('Email') as HTMLInputElement, {target: {value: 'thisisnotanemail'}}
    );
    fireEvent.change(
      inputs.namedItem('Full Name') as HTMLInputElement, {target: {value: 'thisisnotaFu11Name'}}
    );
    fireEvent.change(
      inputs.namedItem('Username') as HTMLInputElement, {target: {value: 'thisisnotausername'}}
    );
    fireEvent.change(
      inputs.namedItem('Password') as HTMLInputElement, {target: {value: 'thisisnotapassword'}}
    );

    const submitButton = screen.getByText('Sign Up') as HTMLButtonElement;
    const forms = container.getElementsByTagName('form') as HTMLCollectionOf<HTMLFormElement>;
    fireEvent.submit(forms.item(0) as HTMLFormElement);

    expect(forms.length).toBe(1);
    expect(submitButton).not.toHaveClass('enabled');
    expect(submitButton).not.toHaveProperty('type', 'submit');
    expect(submitButton).toHaveProperty('disabled');
    expect(spyRegisterUser).not.toHaveBeenCalled();
  });

  test('should submit when form is valid', () => {
    const {container} = render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );


    const inputs = container
      .getElementsByTagName('input') as HTMLCollectionOf<HTMLInputElement>;

    fireEvent.change(
      inputs.namedItem('Email') as HTMLInputElement, {target: {value: 'mock@mocking.com'}}
    );
    fireEvent.change(
      inputs.namedItem('Full Name') as HTMLInputElement, {target: {value: 'Mock Mockings'}}
    );
    fireEvent.change(
      inputs.namedItem('Username') as HTMLInputElement, {target: {value: 'Mockjester'}}
    );
    fireEvent.change(
      inputs.namedItem('Password') as HTMLInputElement, {target: {value: 'THi$IsN0t@Pass'}}
    );

    const submitButton = screen
      .getByText('Sign Up') as HTMLInputElement;
    const forms = container
      .getElementsByTagName('form') as HTMLCollectionOf<HTMLFormElement>;

    fireEvent.submit(forms.item(0) as HTMLFormElement);

    expect(forms.length).toBe(1);
    expect(submitButton).toHaveClass('enabled');
    expect(submitButton).toHaveProperty('type', 'submit');
    expect(submitButton.disabled).toBe(false);
    expect(spyRegisterUser).toHaveBeenCalledTimes(1);
  });
});
