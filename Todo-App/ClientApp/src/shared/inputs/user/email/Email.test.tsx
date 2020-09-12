import React from 'react';
import ValidatedTextInput, {IValidatedTextInput} from '../../validated-input/ValidatedTextInput';
import {render, screen, fireEvent} from '@testing-library/react';
import Email from './Email';

jest.mock('../../validated-input/ValidatedTextInput', () => {
  return jest.fn();
});
describe('Email input component', () => {
  const mockValidatedInputProps = jest.fn();
  const mockSetMessage = jest.fn().mockImplementation((message: string) => {
  });

  const mockValidatedInput: React.FC<IValidatedTextInput> =
    (props: IValidatedTextInput) => {
      mockValidatedInputProps.mockReturnValue(props);

      const valueHandler = (value: string) => {
        props.isValid(value, mockSetMessage) ? props.value(value) : props.value('');
      };

      return (
        <div>
          <input
            onChange={event => valueHandler(event.target.value)}
          />
        </div>
      );
    };

  beforeEach(() => {
    (ValidatedTextInput as jest.Mock)
      .mockImplementation(mockValidatedInput);
  });

  afterEach(() => {
    mockValidatedInputProps.mockClear();
    mockSetMessage.mockClear();
  });

  test('should render, call ValidatedTextInput', () => {
    render(
      <Email email={(value: string) => {}} />
    );

    expect(mockValidatedInputProps()).toMatchObject({
      name: 'Email',
      isValid: {},
      others: {},
      value: {}
    })
  });

  test('should not return input when it is empty', () => {
    let mockValue = '';

    render(
      <Email
        email={(value: string) => {mockValue = value}}
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, {target: {value: 'realemail@email.com'}});
    fireEvent.change(input, {target: {value: ''}});
    expect(mockValue).toBe('');
  });

  test('should call setMessage when input is required', () => {
    render(
      <Email
        email={(value: string) => {}}
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, {target: {value: 'realemail@email.com'}});
    fireEvent.change(input, {target: {value: ''}});
    expect(mockSetMessage).toHaveBeenCalledTimes(2);
    expect(mockSetMessage).not.toHaveBeenLastCalledWith('');
  });

  test('should not return input when it is not valid', () => {
    let mockValue = '';

    render(
      <Email
        email={(value: string) => {mockValue = value}}
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, {target: {value: 'realemailemail.com'}});
    expect(mockValue).toBe('');
  });

  test('should call setMessage when input is not valid', () => {
    render(
      <Email
        email={(value: string) => {}}
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, {target: {value: 'realemail@emailcom'}});
    expect(mockSetMessage).toHaveBeenCalledTimes(1);
    expect(mockSetMessage).not.toHaveBeenLastCalledWith('');
  });
});
