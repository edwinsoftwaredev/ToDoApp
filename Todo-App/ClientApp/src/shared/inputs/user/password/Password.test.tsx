import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import Password from './Password';
import ValidatedTextInput, {IValidatedTextInput} from '../../validated-input/ValidatedTextInput';

jest.mock('../../validated-input/ValidatedTextInput', () => {
  return jest.fn();
});
describe('Password component tests', () => {
  const mockProps = jest.fn();
  const mockSetMessage = jest.fn().mockImplementation((message: string) => {});
  const mockValidatedTextInput: React.FC<IValidatedTextInput> =
    (props: IValidatedTextInput) => {
      mockProps.mockReturnValue(props);
      const valueHandler = (value: string) => {
        props.isValid(value, mockSetMessage) ? props.value(value) : props.value('');
      };
      return (
        <div>
          <input onChange={event => valueHandler(event.target.value)} />
        </div>
      );
    };
  beforeEach(() => {
    (ValidatedTextInput as jest.Mock).mockImplementation(mockValidatedTextInput);
  });

  afterEach(() => {
    mockProps.mockClear();
    mockSetMessage.mockClear();
  });

  test('should render and implements ValidatedTextInput', () => {
    render(
      <Password password={(password: string) => {}} />
    );

    expect(mockProps()).toMatchObject({
      name: 'Password',
      isValid: {},
      value: {},
      others: {}
    });
  });

  test('should not return value and call setMessage when input is required', () => {
    let mockInput = 'NOTTHISVALUE';
    render(
      <Password password={(password: string) => mockInput = password} />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, {target: {value: 'MOCKPASSWORD'}});
    fireEvent.change(input, {target: {value: ''}}); // now it is empty

    expect(mockSetMessage).toHaveBeenCalledTimes(1);
    expect(mockSetMessage).not.toHaveBeenCalledWith('');
    expect(mockInput).toBe('');
  });
});
