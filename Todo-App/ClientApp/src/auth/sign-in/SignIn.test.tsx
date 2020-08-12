import React from 'react';
import SignIn, * as SignInUtils from './SignIn';
import {render} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';

describe('SignIn Component', () => {

  beforeEach(() => {
  });

  afterEach(() => {
  });

  test('should render', () => {
    const signInSpy = jest.spyOn(SignInUtils, 'default');
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    expect(signInSpy).toHaveBeenCalledTimes(1);
  });
});

