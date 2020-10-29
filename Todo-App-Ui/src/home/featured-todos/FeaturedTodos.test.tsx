import React from 'react';
import {act, render, screen, waitFor, fireEvent, waitForElementToBeRemoved} from "@testing-library/react";
import {Provider} from "react-redux";
import Store from "../../store/Store";
import FeturedTodos from "./FeaturedTodos";
import TodoCardService from '../../shared/todo-card/TodoCardService';
import * as TodoUserSelectorHome from '../Home';
import {ITodo} from '../../shared/todo-card/TodoCard';
import {ITodoUser} from '../Home';
import {AxiosResponse} from "axios";

describe('FeturedTodos test', () => {
  let spyTodoCardService: jest.SpyInstance;
  let spyTodoUserSelector: jest.SpyInstance;
  let spyGetFeturedTodos: jest.SpyInstance;
  let spyDeleteTodo: jest.SpyInstance;
  let spyUpdateTodo: jest.SpyInstance;

  const store = Store.getInstance();

  beforeEach(() => {
    spyTodoCardService = jest.spyOn(TodoCardService, 'getFeturedTodos');
    spyTodoUserSelector = jest.spyOn(TodoUserSelectorHome, 'todoUserSelector');
    spyGetFeturedTodos = jest.spyOn(TodoCardService, 'getFeturedTodos');
    spyDeleteTodo = jest.spyOn(TodoCardService, 'removeTodo');
    spyUpdateTodo = jest.spyOn(TodoCardService, 'updateTodo');

    const todoUser: ITodoUser = {
      userId: 'NOTID',
      userName: 'NOTUSERNAME',
      todos: Array.of<ITodo>()
    };
    spyTodoUserSelector.mockImplementation(() => todoUser);
  });

  afterEach(() => {
    spyTodoCardService.mockRestore();
    spyTodoUserSelector.mockRestore();
    spyGetFeturedTodos.mockRestore();
    spyDeleteTodo.mockRestore();
    spyUpdateTodo.mockRestore();
  });

  test('should render', () => {
    render(
      <Provider store={store}>
        <FeturedTodos />
      </Provider>
    );
  });

  test('should get fetured todos at mount time', () => {
    const store = Store.getInstance();
    render(
      <Provider store={store}>
        <FeturedTodos />
      </Provider>
    );

    expect(spyTodoCardService).toHaveBeenCalledTimes(1);
  });

  test('should display todos', async () => {
    const mockTodo: ITodo = {
      id: 1,
      createdById: 'mockuser',
      description: 'mockdescription',
      endDate: '01-01-2020',
      isCompleted: false,
      isFeatured: false,
      title: 'mocktitle'
    };

    spyGetFeturedTodos.mockImplementation(() => {
      const response: AxiosResponse<ITodo[]> = {
        data: [mockTodo],
        headers: '',
        request: '',
        config: {},
        status: 0,
        statusText: ''
      };
      return Promise.resolve(response);
    });

    render(
      <Provider store={store}>
        <FeturedTodos />
      </Provider>
    );

    expect(spyGetFeturedTodos).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.getByDisplayValue('mocktitle')).toBeInTheDocument();
    });
  });

  test('should delete todo', async () => {
    const response: AxiosResponse = {
      statusText: '',
      status: 200,
      config: {},
      request: {},
      headers: {},
      data: {}
    };

    spyDeleteTodo.mockImplementation((id: number) => {
      return Promise.resolve(response)
    });

    const mockTodo: ITodo = {
      id: 1,
      createdById: 'mockuser',
      description: 'mockdescription',
      endDate: '01-01-2020',
      isCompleted: false,
      isFeatured: false,
      title: 'mocktitle'
    };

    spyGetFeturedTodos.mockImplementation(() => {
      const response: AxiosResponse<ITodo[]> = {
        data: [mockTodo],
        headers: '',
        request: '',
        config: {},
        status: 0,
        statusText: ''
      };
      return Promise.resolve(response);
    });

    const {container} = render(
      <Provider store={store}>
        <FeturedTodos />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('mocktitle')).toBeInTheDocument();
      expect(container.getElementsByClassName('bx bx-edit')[0]).toBeInTheDocument();
      expect(container.getElementsByClassName('bx bx-trash')[0]).toBeInTheDocument();
    }).then(async () => {
      const btnEdit = container.getElementsByClassName('bx bx-edit')[0] as HTMLElement;
      const btnDelete = container.getElementsByClassName('bx bx-trash')[0] as HTMLElement;
      btnEdit.click();
      btnDelete.click();
      await waitFor(() => {
        expect(spyDeleteTodo).toHaveBeenCalledTimes(1);
      });
    });
  });


  test('should updateTodo todo', async () => {
    const response: AxiosResponse = {
      statusText: '',
      status: 200,
      config: {},
      request: {},
      headers: {},
      data: {}
    };

    spyUpdateTodo.mockImplementation((todo: ITodo) => {
      return Promise.resolve(response)
    });

    const mockTodo: ITodo = {
      id: 1,
      createdById: 'mockuser',
      description: 'mockdescription',
      endDate: '01-01-2020',
      isCompleted: false,
      isFeatured: false,
      title: 'mocktitle'
    };

    spyGetFeturedTodos.mockImplementation(() => {
      const response: AxiosResponse<ITodo[]> = {
        data: [mockTodo],
        headers: '',
        request: '',
        config: {},
        status: 0,
        statusText: ''
      };
      return Promise.resolve(response);
    });

    const {container} = render(
      <Provider store={store}>
        <FeturedTodos />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('mocktitle')).toBeInTheDocument();
      expect(container.getElementsByClassName('bx bx-edit')[0]).toBeInTheDocument();
      expect(container.getElementsByClassName('bx bx-trash')[0]).toBeInTheDocument();
    }).then(async () => {
      const btnEdit = container.getElementsByClassName('bx bx-edit')[0] as HTMLElement;
      btnEdit.click();
      const titleInput = screen.getByDisplayValue('mocktitle');
      fireEvent.change(titleInput, {target: {value: 'newmocktitle'}});
      btnEdit.click();
      await  waitFor(() => {
        expect(spyUpdateTodo).toHaveBeenCalledTimes(1);
        expect(screen.getByDisplayValue('newmocktitle')).toBeInTheDocument();
      })
    });
  });
});
