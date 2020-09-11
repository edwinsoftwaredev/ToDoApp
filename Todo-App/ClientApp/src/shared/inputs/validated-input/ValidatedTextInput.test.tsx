import React from 'react';
import ValidatedTextInput, {IValidatedTextInput} from './ValidatedTextInput';
import {render, fireEvent, screen} from '@testing-library/react';
import pretty from 'pretty';

describe('ValidatedTextInput component', () => {
  beforeEach(() => {});

  beforeAll(() => {});

  test('should render', () => {
    const mockProps = {
      isValid: {},
      name: 'MOCKNAME',
      others: {
        autoComplete: 'off',
        maxLength: 20,
        minLength: 6,
      },
      value: {},
    };

    render(<ValidatedTextInput {...mockProps} />);
  });

  test('should return input value to callback', () => {
    let mockInputValue = 'NOTTHISVALUE';
    const mockClbkFunc = (value: string) => {
      mockInputValue = value;
    };

    const mockProps = {
      isValid: (value: string, setMessage: (message: string) => void) => true,
      name: 'MOCKNAME',
      others: {
        autoComplete: 'off',
        maxLength: 20,
        minLength: 6,
      },
      value: mockClbkFunc,
    };

    render(<ValidatedTextInput {...mockProps} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, {target: {value: 'THISVALUE'}});
    expect(mockInputValue).toBe('THISVALUE');
  });

  test('should not be valid when isValid is set to false, message is setted and touched', () => {
    const mockMessage = 'MOCKMESSAGEERROR';

    const mockValidate = (value: string, setMessage: (message: string) => void) => {
      setMessage(mockMessage);
      return false;
    };

    const mockProps = {
      isValid: mockValidate,
      name: 'MOCKNAME',
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
            <div>MOCKNAME MOCKMESSAGEERROR</div>
          </div>
        </div><input class=\\"uk-input\\" type=\\"text\\" name=\\"MOCKNAME\\" autocomplete=\\"off\\" maxlength=\\"20\\" minlength=\\"6\\">
      </div>"
    `);
  });

  test('should be valid when isValid is set to true and touched', () => {
    const mockProps = {
      isValid: (value: string, setMessage: (message: string) => void) => true,
      name: 'MOCKNAME',
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
      "<div class=\\"validated-input-text valid\\">
        <div class=\\"message-bar\\">
          <div class=\\"message\\">
            <div>MOCKNAME </div>
          </div>
        </div><input class=\\"uk-input\\" type=\\"text\\" name=\\"MOCKNAME\\" autocomplete=\\"off\\" maxlength=\\"20\\" minlength=\\"6\\">
      </div>"
    `);
  });
});
