import React from 'react';
import {render} from '@testing-library/react';
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
});
