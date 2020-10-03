import React from 'react';
import {render} from '@testing-library/react';
import SignOut from './SignOut';
import {MemoryRouter} from 'react-router-dom';
import {AuthService} from '../AuthService';

describe('SignOut tests', () => {
  let completeSignOutSpy: jest.SpyInstance<any>;
  const authService = AuthService.getInstance();
  beforeEach(() => {
    completeSignOutSpy = jest.spyOn(authService, 'completeSignOut')
  });

  afterEach(() => {
    completeSignOutSpy.mockClear();
  });

  test('should render', () => {
    render(
      <MemoryRouter>
        <SignOut />
      </MemoryRouter>
    );
  });

  test('should call completeSignOut at startup', () => {
    render(
      <MemoryRouter>
        <SignOut />
      </MemoryRouter>
    );

    expect(completeSignOutSpy).toHaveBeenCalledTimes(1);
  });
});
