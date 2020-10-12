import Axios, {AxiosResponse} from 'axios';
import {ITodo} from './TodoCard';

export default class TodoCardService {
  public static saveTodo(todo: ITodo): Promise<AxiosResponse<number>> {
    return Axios.post(`${process.env.REACT_APP_API_SERVER_URL}/api/todo`, todo);
  }

  public static updateTodo(todo: ITodo): Promise<AxiosResponse> {
    return Axios.put(`${process.env.REACT_APP_API_SERVER_URL}/api/todo/${todo.id}`, todo);
  }

  public static removeTodo(id: number): Promise<AxiosResponse> {
    return Axios.delete(`${process.env.REACT_APP_API_SERVER_URL}/api/todo/${id}`);
  }
}
