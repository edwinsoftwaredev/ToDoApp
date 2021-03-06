import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';
import ConfirmPassword from './ConfirmPassword';
import ValidatedTextInput, {IValidatedTextInput} from '../../validated-input/ValidatedTextInput';

jest.mock('../../validated-input/ValidatedTextInput', () => {
  return jest.fn();
});
describe('ConfirmPassword component tests', () => {
  const mockProps = jest.fn();
  const mockSetMessage = jest.fn().mockImplementation((message: string) => {
  });

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
    let mockValue = '';

    render(
      <ConfirmPassword confirmPassword={(value: string) => mockValue = value} />
    );

    expect(mockValue).toBe('');
    expect(mockProps()).toMatchObject({
      name: 'Confirm Password',
      isValid: {},
      value: {},
      others: {}
    });
  });

  test('should not return value and call setMessage when input is empty', () => {
    let mockInput = 'NOTTHISVALUE';

    render(
      <ConfirmPassword confirmPassword={(value: string) => mockInput = value} />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, {target: {value: 'ITWILLBEEMPTYNEXTLINE'}});
    fireEvent.change(input, {target: {value: ''}});

    expect(mockSetMessage).toHaveBeenCalledTimes(2); // 2 because when is empty setMessage('')
    expect(mockSetMessage).not.toHaveBeenLastCalledWith('');
    expect(mockInput).toBe('');
  });
});
