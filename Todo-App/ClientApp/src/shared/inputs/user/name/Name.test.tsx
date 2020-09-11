import React from 'react';
import Name from './Name';
import ValidatedTextInput, {IValidatedTextInput} from '../../validated-input/ValidatedTextInput';
import {render, screen, fireEvent} from '@testing-library/react';

jest.mock('../../validated-input/ValidatedTextInput', () => {
  return jest.fn();
});
describe('Name component', () => {

  const mockProps = jest.fn();
  const mockValidatedTextInput: React.FC<IValidatedTextInput> = (props: IValidatedTextInput) => {
    mockProps.mockReturnValue(props);

    const valueHandler = (value: string) => {
      // this is a callback function.
      // isValid is placed in Name component
      props.isValid(value, (message: string) => {}) ? props.value(value) : props.value('');
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
      .mockImplementation(mockValidatedTextInput);
  });

  afterEach(() => {
    mockProps.mockClear();
  });

  test('should render and implements ValidatedTextInput', () => {
    render(
      <Name
        name={(value: string) => {}}
      />
    );

    expect(mockProps())
      .toMatchObject({
        name: 'Name',
        isValid: {},
        others: {
          autoComplete: 'off',
          maxLength: 200,
        },
        value: {}
      });
  });

  test('should return value when input is valid', () => {
    let mockValue = 'NOTTHISVALUE';
    render(
      <Name name={(value: string) => mockValue = value} />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, {target: {value: 'THISVALUE'}});
    expect(mockValue).toBe('THISVALUE');
  });

  test('should not return value when input is not valid', () => {
    let mockValue = 'NOTTHISVALUE';
    render(
      <Name
        name={(value: string) => mockValue = value}
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, {target: {value: 'THISHASAN@'}});
    expect(mockValue).toBe('');
  });
});
