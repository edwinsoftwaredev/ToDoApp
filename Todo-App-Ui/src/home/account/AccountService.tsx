import Axios, {AxiosResponse} from "axios";

export default class AccountService {
  public static deleteTodoAccount(id: string): Promise<AxiosResponse<void>> {
    return Axios.delete(`${process.env.REACT_APP_TODO_SERVER_ULR}/api/todouser?id=${id}`);
  }
  
  /* this is not ideal. The ideal solution is having, in the authentication server,
  * a component to let users to manage their own account.
  */ 
  public static deleteAccount(id: string): Promise<AxiosResponse<void>> {
    return Axios.delete(`${process.env.REACT_APP_AUTH_SERVER_URL}/api/user?id=${id}`);
  }
}
