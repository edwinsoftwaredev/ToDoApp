import React from 'react';
import {render, wait} from '@testing-library/react';
import SignOut from './SignOut';
import {MemoryRouter} from 'react-router-dom';
import {AccountService} from "../AccountService";

describe('SignOut tests', () => {
  beforeEach(() => {
  });

  afterEach(() => {
  });

  test('should render', () => {
    render(
      <MemoryRouter>
        <SignOut />
      </MemoryRouter>
    );
  });
});
