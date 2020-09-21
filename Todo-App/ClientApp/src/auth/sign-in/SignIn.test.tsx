import React from 'react';
import SignIn, * as SignInUtils from './SignIn';
import {render, fireEvent, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import * as Username from '../../shared/inputs/user/username/Username';
import * as Password from '../../shared/inputs/user/password/Password';
import {AccountService} from '../../auth/AccountService';

describe('SignIn Component', () => {
  let spyUsername: jest.SpyInstance<any>;
  let spyPassword: jest.SpyInstance<any>;
  let spyLoginUser: jest.SpyInstance<any>;

  beforeEach(() => {
    spyPassword = jest.spyOn(Password, 'default');
    spyUsername = jest.spyOn(Username, 'default');
    spyLoginUser = jest.spyOn(AccountService, 'loginUser');
  });

  afterEach(() => {
    spyUsername.mockClear();
    spyPassword.mockClear();
    spyLoginUser.mockClear();
  });

  test('should render', () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );
  });

  test('should have username and password component fields and 2 buttons', () => {
    const {container} = render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    const inputs =
      container.getElementsByTagName('input') as HTMLCollectionOf<HTMLInputElement>;

    const buttons =
      container.getElementsByTagName('button') as HTMLCollectionOf<HTMLButtonElement>;

    expect(inputs.length).toBe(2);
    // Sign In and Sign Up buttons
    expect(buttons.length).toBe(2);

    expect(spyUsername).toHaveBeenCalledTimes(1);
    expect(spyPassword).toHaveBeenCalledTimes(1);
  });

  test('should not submit when inputs are not valid', () => {
    const {container} = render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    const inputs =
      container.getElementsByTagName('input') as HTMLCollectionOf<HTMLInputElement>;

    fireEvent.change(
      inputs.namedItem('Username') as HTMLInputElement, {target: {value: 'THISISNOTAUSERNAME'}}
    );

    fireEvent.change(
      inputs.namedItem('Password') as HTMLInputElement, {target: {value: 'THISISNOTAPASSWORD'}}
    );

    const submitButton = screen.getByText('Sign In') as HTMLButtonElement;
    const forms = container.getElementsByTagName('form') as HTMLCollectionOf<HTMLFormElement>;
    fireEvent.submit(forms.item(0) as HTMLFormElement);

    expect(forms.length).toBe(1);
    expect(submitButton).not.toHaveClass('enabled');
    expect(submitButton).not.toHaveProperty('type', 'submit');
    expect(submitButton).toHaveProperty('disabled');
    expect(spyLoginUser).not.toHaveBeenCalled();
  });

  test('should submit when form is valid and call loginUser', () => {
    const {container} = render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    const inputs =
      container.getElementsByTagName('input') as HTMLCollectionOf<HTMLInputElement>;

    fireEvent.change(
      inputs.namedItem('Username') as HTMLInputElement, {target: {value: 'Mockjester'}}
    );
    fireEvent.change(
      inputs.namedItem('Password') as HTMLInputElement, {target: {value: 'THi$IsN0t@Pass'}}
    );

    const submitButton = screen.getByText('Sign In') as HTMLButtonElement;
    const forms = container.getElementsByTagName('form') as HTMLCollectionOf<HTMLFormElement>;
    fireEvent.submit(forms.item(0) as HTMLFormElement);

    expect(forms.length).toBe(1);
    expect(submitButton).toHaveClass('enabled');
    expect(submitButton).toHaveProperty('type', 'submit');
    expect(submitButton.disabled).toBe(false);
    expect(spyLoginUser).toHaveBeenCalledTimes(1);
  });
});

