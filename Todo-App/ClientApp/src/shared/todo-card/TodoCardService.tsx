import Axios, {AxiosResponse} from 'axios';
import {ITodo} from './TodoCard';

export default class TodoCardService {
  public static getTodos(): Promise<AxiosResponse<ITodo[]>> {
    return Axios.get(`${process.env.REACT_APP_API_SERVER_URL}/api/todos`);
  }

  public static getFeturedTodos(): Promise<AxiosResponse<ITodo[]>> {
    return Axios.get(`${process.env.REACT_APP_API_SERVER_URL}/api/todos/featured`);
  }

  public static getCompletedTodos(): Promise<AxiosResponse<ITodo[]>> {
    return Axios.get(`${process.env.REACT_APP_API_SERVER_URL}/api/todos/completed`);
  }

  public static saveTodo(todo: ITodo): Promise<AxiosResponse<ITodo>> {
    return Axios.post(`${process.env.REACT_APP_API_SERVER_URL}/api/todos`, todo);
  }

  public static updateTodo(todo: ITodo): Promise<AxiosResponse<void>> {
    return Axios.put(`${process.env.REACT_APP_API_SERVER_URL}/api/todos/${todo.id}`, todo);
  }

  public static removeTodo(id: number): Promise<AxiosResponse<void>> {
    return Axios.delete(`${process.env.REACT_APP_API_SERVER_URL}/api/todos/${id}`);
  }
}
