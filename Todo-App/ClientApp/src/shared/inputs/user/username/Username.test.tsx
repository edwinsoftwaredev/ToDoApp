import React from 'react';
import {render, screen, fireEvent} from "@testing-library/react";
import Username from "./Username";
import Message, {IMessage} from '../../../message/Message';

jest.mock('../../../message/Message', () => {
  return jest.fn();
});

describe('Username input component', () => {
  const mockProps = jest.fn();
  const mockMessage: React.FC<IMessage> = (props: any) => {
    // console.log(props);

    // this line is needed for spiying the values in props
    mockProps.mockReturnValue(props);
    return null;
  };

  beforeEach(() => {
    (Message as jest.Mock).mockImplementation(mockMessage);
  });

  afterEach(() => {
    mockProps.mockClear();
  });

  // Message is called everytime Username is rendered.
  // if this line: <Message {...props} /> is in Username then
  // Message will be called everytime Username is rendered.
  // Functionality about if a message is DISPLAYED in Username or any other
  // component that implements Message component has to be tested in Message component!
  //
  // Functionality about the error message used by Message component to displayed it,
  // has to be tested in the components that implement Message Component!
  test('should call/implement Message', () => {
    render
      (
        <Username
          username={
            (username: string) => {}
          }
        />
      );

    expect(mockProps()).toEqual({text: ''});
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

    const input = screen.getByPlaceholderText('Username') as HTMLInputElement;
    // the next two lines triggers the setState for username
    fireEvent.change(input, {target: {value: 'willbeemptyinnextline'}});
    fireEvent.change(input, {target: {value: ''}});
    expect(usernameReturned).toBe('');
  });

  test('should return username when input is not empty', () => {
    const mockUsername = 'iamtheadmin';
    let usernameReturned = 'shouldbemock';
    render
      (
        <Username
          username={
            (username: string) => {usernameReturned = username}
          }
        />
      );

    const input = screen.getByPlaceholderText('Username') as HTMLInputElement;
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

    const input = screen.getByPlaceholderText('Username') as HTMLInputElement;
    fireEvent.change(input, {target: {value: mockUsername}});
    expect(mockProps()).toEqual({text: ''});
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

    const input = screen.getByPlaceholderText('Username') as HTMLInputElement;
    // the next two lines do a input touch
    fireEvent.change(input, {target: {value: 'willbeemptyinnextline'}});
    fireEvent.change(input, {target: {value: ''}});
    expect(mockProps()).not.toEqual({text: ''});
  });
});
