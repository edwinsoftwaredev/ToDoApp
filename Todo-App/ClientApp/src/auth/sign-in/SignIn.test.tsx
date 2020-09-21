import React from 'react';
import SignIn, * as SignInUtils from './SignIn';
import {render} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import * as Username from '../../shared/inputs/user/username/Username';
import * as Password from '../../shared/inputs/user/password/Password';


describe('SignIn Component', () => {
  let spyUsername: jest.SpyInstance<any>;
  let spyPassword: jest.SpyInstance<any>;

  beforeEach(() => {
    spyPassword = jest.spyOn(Password, 'default');
    spyUsername = jest.spyOn(Username, 'default');
  });

  afterEach(() => {
    spyUsername.mockClear();
    spyPassword.mockClear();
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
});

