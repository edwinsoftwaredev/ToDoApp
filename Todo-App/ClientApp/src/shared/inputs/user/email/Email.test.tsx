import React from 'react';
import ValidatedTextInput, {IValidatedTextInput} from '../../validated-input/ValidatedTextInput';
import {render} from '@testing-library/react';
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
});
