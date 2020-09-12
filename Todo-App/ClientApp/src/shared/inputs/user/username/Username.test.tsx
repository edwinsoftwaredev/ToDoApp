import React from 'react';
import {render, screen, fireEvent} from "@testing-library/react";
import Username from "./Username";
import ValidatedTextInput, {IValidatedTextInput} from '../../validated-input/ValidatedTextInput';

jest.mock('../../validated-input/ValidatedTextInput', () => {
  return jest.fn();
});

describe('Username input component', () => {
  const mockProps = jest.fn();
  const mockSetMessage = jest.fn().mockImplementation((message: string) => {
  });
  const mockTextInput: React.FC<IValidatedTextInput> = (props: any) => {
    // console.log(props);

    // this line is needed for spiying the values in props
    mockProps.mockReturnValue(props);

    const textHandler = (value: string) => {
      props.isValid(value, mockSetMessage) ? props.value(value) : props.value('');
    };

    return (
      <div>
        <input
          onChange={
            event => textHandler(event.target.value)
          }
        />
      </div>
    );
  };

  beforeEach(() => {
    (ValidatedTextInput as jest.Mock).mockImplementation(mockTextInput);
  });

  afterEach(() => {
    mockProps.mockClear();
    mockSetMessage.mockClear();
  });

  // Message is called everytime Username is rendered.
  // if this line: <Message {...props} /> is in Username then
  // Message will be called everytime Username is rendered.
  // Functionality about if a message is DISPLAYED in Username or any other
  // component that implements Message component has to be tested in Message component!
  //
  // Functionality about the error message used by Message component to displayed it,
  // has to be tested in the components that implement Message Component!
  test('should call/implement ValidatedTextInput', () => {
    render
      (
        <Username
          username={
            (username: string) => {}
          }
        />
      );

    expect(mockProps())
      .toMatchObject({
        name: 'Username',
        isValid: {},
        others: {
          autoComplete: 'off',
          maxLength: 20,
          minLength: 6
        },
        value: {}
      });
  });

  test('should not return username when input is empty', () => {
    let usernameReturned = 'shouldbeempty';
    render
      (
        <Username
          username={
            (username: string) => {usernameReturned = username}
          } />
      );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    // the next two lines triggers the setState for username
    fireEvent.change(input, {target: {value: 'willbeemptyinnextline'}});
    fireEvent.change(input, {target: {value: ''}});
    expect(usernameReturned).toBe('');
  });

  test('should return username when input is not empty', () => {
    const mockUsername = 'iamtheadmin';
    let usernameReturned = 'shouldbemock';
    const mockClbkFunc = (username: string) => {
      usernameReturned = username;
    };
    render
      (
        <Username
          username={(username: string) => mockClbkFunc(username)} />
      );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, {target: {value: mockUsername}});

    expect(usernameReturned).toBe(mockUsername);
  });

  test('should setUsernameErrorMessage to "" when input is not empty', () => {
    const mockUsername = 'iamtheadmin';
    render
      (
        <Username
          username={
            (username: string) => {}
          }
        />
      );


    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, {target: {value: mockUsername}});

    expect(mockSetMessage).toHaveBeenCalledTimes(1);
    expect(mockSetMessage).toHaveBeenCalledWith('');
  });

  test('should setUsernameErrorMessage when input is empty', () => {
    render
      (
        <Username
          username={
            (username: string) => {}
          }
        />
      );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    // the next two lines do a input touch
    fireEvent.change(input, {target: {value: 'willbeemptyinnextline'}});
    fireEvent.change(input, {target: {value: ''}});

    expect(mockSetMessage).toHaveBeenCalledTimes(2);
    expect(mockSetMessage).not.toHaveBeenLastCalledWith('');
  });

  // here should be added more test cases for input validation
});
