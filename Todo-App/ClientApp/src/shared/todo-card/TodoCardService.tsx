import Axios, {AxiosResponse} from 'axios';
import {ITodo} from './TodoCard';
import {AuthService} from '../../auth/AuthService';

export default class TodoCardService {
  private static authService = AuthService.getInstance();

  public static async getTodos(): Promise<AxiosResponse<ITodo[]>> {
    const user = await this.authService.getUser();
    return Axios.get(`${process.env.REACT_APP_API_SERVER_URL}/api/todo`, {
      headers: {'Authorization': `${user?.token_type} ${user?.access_token}`}
    });
  }

  public static async getFeturedTodos(): Promise<AxiosResponse<ITodo[]>> {
    const user = await this.authService.getUser();
    return Axios.get(`${process.env.REACT_APP_API_SERVER_URL}/api/todo/featured`, {
      headers: {'Authorization': `${user?.token_type} ${user?.access_token}`}
    });
  }

  public static async getCompletedTodos(): Promise<AxiosResponse<ITodo[]>> {
    const user = await this.authService.getUser();
    return Axios.get(`${process.env.REACT_APP_API_SERVER_URL}/api/todo/completed`, {
      headers: {'Authorization': `${user?.token_type} ${user?.access_token}`}
    });
  }

  public static async saveTodo(todo: ITodo): Promise<AxiosResponse<ITodo>> {
    const user = await this.authService.getUser();
    return Axios.post(`${process.env.REACT_APP_API_SERVER_URL}/api/todo`, todo, {
      headers: {'Authorization': `${user?.token_type} ${user?.access_token}`}
    });
  }

  public static async updateTodo(todo: ITodo): Promise<AxiosResponse<void>> {
    const user = await this.authService.getUser();
    return Axios.put(`${process.env.REACT_APP_API_SERVER_URL}/api/todo/${todo.id}`, todo, {
      headers: {'Authorization': `${user?.token_type} ${user?.access_token}`}
    });
  }

  public static async removeTodo(id: number): Promise<AxiosResponse<void>> {
    const user = await this.authService.getUser();
    return Axios.delete(`${process.env.REACT_APP_API_SERVER_URL}/api/todo/${id}`, {
      headers: {'Authorization': `${user?.token_type} ${user?.access_token}`}
    });
  }
}
