import React from 'react';
import {render} from "@testing-library/react";
import {Provider} from "react-redux";
import Store from "../../store/Store";
import CompletedTodos from "./CompletedTodos";
import TodoCardService from '../../shared/todo-card/TodoCardService';
import * as TodoUserSelectorHome from '../Home';
import {ITodo} from '../../shared/todo-card/TodoCard';
import {ITodoUser} from '../Home';

describe('CompletedTodos test', () => {
  let spyTodoCardService: jest.SpyInstance;
  let spyTodoUserSelector: jest.SpyInstance;

  beforeEach(() => {
    spyTodoCardService = jest.spyOn(TodoCardService, 'getCompletedTodos');
    spyTodoUserSelector = jest.spyOn(TodoUserSelectorHome, 'todoUserSelector');
  });

  afterEach(() => {
    spyTodoCardService.mockRestore();
    spyTodoUserSelector.mockRestore();
  });

  test('should render', () => {
    const store = Store.getInstance();
    render(
      <Provider store={store}>
        <CompletedTodos />
      </Provider>
    );
  });

  test('should get completed todos at mount time', () => {
    const store = Store.getInstance();
    const todoUser: ITodoUser = {
      userId: 'NOTID',
      userName: 'NOTUSERNAME',
      todos: Array.of<ITodo>()
    };

    spyTodoUserSelector.mockImplementation(() => todoUser);
    render(
      <Provider store={store}>
        <CompletedTodos />
      </Provider>
    );

    expect(spyTodoCardService).toHaveBeenCalledTimes(1);
  });

  test('should display todos', () => {
    const store = Store.getInstance();

    render(
      <Provider store={store}>
        <CompletedTodos />
      </Provider>
    );
  });

  test('should delete todo', () => {
    const store = Store.getInstance();

    render(
      <Provider store={store}>
        <CompletedTodos />
      </Provider>
    );
  });

  test('should updateTodo todo', () => {
    const store = Store.getInstance();

    render(
      <Provider store={store}>
        <CompletedTodos />
      </Provider>
    );
  });
});
