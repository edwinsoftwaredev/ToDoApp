import React from 'react';
import ValidatedTextInput, {IValidatedTextInput} from './ValidatedTextInput';
import {render, fireEvent, screen} from '@testing-library/react';
import pretty from 'pretty';

describe('ValidatedTextInput component', () => {
  beforeEach(() => {});

  beforeAll(() => {});

  test('should render', () => {
    const mockProps = {
      isValid: false,
      message: '',
      name: 'Username',
      others: {
        autoComplete: 'off',
        maxLength: 20,
        minLength: 6,
      },
      value: (value: string) => {},
    };

    render(<ValidatedTextInput {...mockProps} />);
  });

  test('should not be valid when isValid is set to false, message is setted and touched', () => {
    const mockProps = {
      isValid: false,
      message: 'MOCKMESSAGEERROR',
      name: 'Username',
      others: {
        autoComplete: 'off',
        maxLength: 20,
        minLength: 6,
      },
      value: (value: string) => {},
    };

    const {container} = render(<ValidatedTextInput {...mockProps} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, {target: {value: 'TOUCHED'}});

    expect(pretty(container.innerHTML)).toMatchInlineSnapshot(`
      "<div class=\\"validated-input-text not-valid\\">
        <div class=\\"message-bar\\">
          <div class=\\"message\\">
            <div>Username MOCKMESSAGEERROR</div>
          </div>
        </div><input class=\\"uk-input\\" type=\\"text\\" name=\\"Username\\" autocomplete=\\"off\\" maxlength=\\"20\\" minlength=\\"6\\">
      </div>"
    `);
  });
});
