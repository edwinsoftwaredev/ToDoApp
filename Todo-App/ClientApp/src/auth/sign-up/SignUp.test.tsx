import React from 'react';
import SignUp, * as SignUpUtils from './SignUp';
import {render} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';

describe('SignUp Component', () => {
  beforeEach(() => {
  });

  afterEach(() => {
  });

  test('should render', () => {
    const signUpSpy = jest.spyOn(SignUpUtils, 'default');
    render(<MemoryRouter><SignUp /></MemoryRouter>);
    expect(signUpSpy).toHaveBeenCalledTimes(1);
  });
});
