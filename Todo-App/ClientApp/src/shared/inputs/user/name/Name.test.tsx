import React from 'react';
import Name from './Name';
import ValidatedTextInput, {IValidatedTextInput} from '../../validated-input/ValidatedTextInput';
import {render} from '@testing-library/react';

jest.mock('../../validated-input/ValidatedTextInput', () => {
  return jest.fn();
});
describe('Name component', () => {

  const mockProps = jest.fn();
  const mockValidatedTextInput: React.FC<IValidatedTextInput> = (props: IValidatedTextInput) => {
    mockProps.mockReturnValue(props);

    const valueHandler = (value: string) => {
      props.value(value);
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
        },
        value: {}
      });
  });
});
