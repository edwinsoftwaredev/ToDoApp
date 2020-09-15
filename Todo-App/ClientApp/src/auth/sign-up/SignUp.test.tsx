import React from 'react';
import SignUp, * as SignUpUtils from './SignUp';
import {render, screen, fireEvent} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {AuthService} from '../AuthService';
import Email, {IEmail} from '../../shared/inputs/user/email/Email';
import Name from '../../shared/inputs/user/name/Name';
import Username from '../../shared/inputs/user/username/Username';
import Password from '../../shared/inputs/user/password/Password';

jest.mock('../../shared/inputs/user/email/Email');
jest.mock('../../shared/inputs/user/name/Name');
jest.mock('../../shared/inputs/user/username/Username');
jest.mock('../../shared/inputs/user/password/Password');
describe('SignUp Component', () => {
  let spyStartAuthentication: jest.SpyInstance<Promise<void>>;
  const authService: AuthService = AuthService.getInstance();

  beforeEach(() => {
    spyStartAuthentication = jest.spyOn(authService, 'startAuthentication');
    (Email as jest.Mock).mockImplementation(() => null);
    (Name as jest.Mock).mockImplementation(() => null);
    (Username as jest.Mock).mockImplementation(() => null);
    (Password as jest.Mock).mockImplementation(() => null);
  });

  afterEach(() => {
    spyStartAuthentication.mockClear();
    (Email as jest.Mock).mockClear();
    (Name as jest.Mock).mockClear();
    (Username as jest.Mock).mockClear();
    (Password as jest.Mock).mockClear();
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
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    expect(Email as jest.Mock).toHaveBeenCalledTimes(1);
    expect(Name as jest.Mock).toHaveBeenCalledTimes(1);
    expect(Username as jest.Mock).toHaveBeenCalledTimes(1);
    expect(Password as jest.Mock).toHaveBeenCalledTimes(1);
  });
});
