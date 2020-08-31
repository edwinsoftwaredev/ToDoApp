import React from 'react';
import SignUp, * as SignUpUtils from './SignUp';
import {render, screen, fireEvent} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {AuthService} from '../AuthService';
import {AccountService} from '../AccountService';
import {act} from 'react-dom/test-utils';

describe('SignUp Component', () => {
  let spyStartAuthentication: jest.SpyInstance<Promise<void>>;
  const authService: AuthService = AuthService.getInstance();

  beforeEach(() => {
    spyStartAuthentication = jest.spyOn(authService, 'startAuthentication');
  });

  afterEach(() => {
    spyStartAuthentication.mockClear();
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
    const mockFunc = (userObj: object): Promise<void> => {
      return Promise.resolve();
    };
    // To mock a static method it must be assigned to mock function
    // like next:
    AccountService.registerUser = mockFunc;

    // this has to happend after the static method was assigned to a mock function
    let spyRegisterUser = jest.spyOn(AccountService, 'registerUser');

    render(<MemoryRouter><SignUp /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', {name: 'Sign Up'}));

    await expect(spyRegisterUser).toHaveBeenCalledTimes(1);
    await expect(spyStartAuthentication).toHaveBeenCalledTimes(1);

    spyRegisterUser.mockClear();
  });

  test('should not startAuthentication. User was not succesfully submited', async () => {
    const mockFunc = (userObj: object) => {
      return Promise.reject({message: 'MOCK_SERVER_ERROR'});
    };
    AccountService.registerUser = mockFunc;
    let spyRegisterUser = jest.spyOn(AccountService, 'registerUser');

    render(<MemoryRouter><SignUp /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', {name: 'Sign Up'}));

    // !!Important note!!
    // Although react-testing-library uses act() when it renders a component
    // there are cases which requires act() to be used. Those cases include execution of
    // async tasks which changes the state in react components like the ones in this test case.
    // If act() is not executed a warning, about a react component state is logged.
    //
    // act():
    // Wrap any code rendering and triggering updates to your components into
    // Ensures that the behavior in your tests matches what happens in the browser...
    // check docs
    await act(async () => {
      expect(spyRegisterUser).toHaveBeenCalledTimes(1);
      expect(spyStartAuthentication).not.toHaveBeenCalled();
    });
    spyRegisterUser.mockClear();
  });
});
