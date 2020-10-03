import React from 'react';
import {render, wait, waitForDomChange} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import * as AuthCodesExp from './AuthCodes';
import {Provider} from 'react-redux';
import Store from '../../store/Store';
import {AuthService} from '../AuthService';

describe('AuthCodes tests', () => {

  const store = Store.getInstance();
  let completeAuthenticationSpy: jest.SpyInstance<any>;
  let saveUserSpy: jest.SpyInstance<any>;
  const authService = AuthService.getInstance();

  beforeEach(() => {
    completeAuthenticationSpy = jest.spyOn(authService, 'completeAuthentication');
    saveUserSpy = jest.spyOn(AuthCodesExp, 'saveUser')
  });

  afterEach(() => {
    completeAuthenticationSpy.mockClear();
    saveUserSpy.mockClear();
  });

  test('should render', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <AuthCodesExp.default />
        </MemoryRouter>
      </Provider>
    );
    await wait();
  });

  test('should call completeAuthentication', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <AuthCodesExp.default /> {/*AuthCodes default export is being called*/}
        </MemoryRouter>
      </Provider>
    );
    await wait();
    expect(completeAuthenticationSpy).toHaveBeenCalledTimes(1);
  });

  test('should not call saveUser if completeAuthentication is resolved to void', async () => {
    completeAuthenticationSpy.mockImplementation(() => {
      return Promise.resolve();
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <AuthCodesExp.default /> {/*AuthCodes default export is being called*/}
        </MemoryRouter>
      </Provider>
    );
    await wait();
    expect(AuthCodesExp.saveUser).not.toHaveBeenCalled();
  });
});
