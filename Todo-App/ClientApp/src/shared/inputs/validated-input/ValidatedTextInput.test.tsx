import React from 'react';
import ValidatedTextInput, {IValidatedTextInput} from './ValidatedTextInput';
import {render} from '@testing-library/react';

describe('ValidatedTextInput component', () => {

  beforeEach(() => {
  });

  beforeAll(() => {
  });

  test('should render', () => {
    const mockProps = {
      isValid: false,
      message: '',
      name: 'Username',
      others: {
        autoComplete: 'off',
        maxLength: 20,
        minLength: 6
      },
      value: (value: string) => {}
    }

    render(
      <ValidatedTextInput {...mockProps} />
    );
  });
});
