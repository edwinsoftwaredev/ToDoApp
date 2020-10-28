import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import Account from "./Account";
import {Provider} from "react-redux";
import Store from "../../store/Store";
import * as Username from "../../shared/inputs/user/username/Username";
import AccountService from "./AccountService";

describe('Account tests', () => {
  beforeEach(() => {
  });

  afterEach(() => {
  });

  test('should render', () => {
    const store = Store.getInstance();
    const spyAccountService = jest.spyOn(AccountService, 'deleteTodoAccount');
    render(
      <Provider store={store} >
        <Account />
      </Provider>
    );

    expect(spyAccountService).not.toHaveBeenCalled();
    spyAccountService.mockRestore();
  });

  test('should call Username component', () => {
    const store = Store.getInstance();
    const spyUsername = jest.spyOn(Username, 'default');
    render(
      <Provider store={store}>
        <Account />
      </Provider>
    );

    expect(spyUsername).toHaveBeenCalledTimes(1);
    spyUsername.mockRestore();
  });

  test('should have a delete account button', () => {
    const store = Store.getInstance();
    render(
      <Provider store={store}>
        <Account />
      </Provider>
    );

    expect(screen.getByText('Delete Todo Account')).toBeInTheDocument();
  });

  test('should call delete service method when delete account button is clicked', () => {
    const store = Store.getInstance();
    const spyAccountService = jest.spyOn(AccountService, 'deleteTodoAccount');
    render(
      <Provider store={store}>
        <Account />
      </Provider>
    );

    fireEvent.click(screen.getByText('Delete Todo Account'));

    expect(spyAccountService).toHaveBeenCalledTimes(1);

    spyAccountService.mockRestore();

  });
});
