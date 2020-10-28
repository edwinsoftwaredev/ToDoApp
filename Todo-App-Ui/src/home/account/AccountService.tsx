import Axios, {AxiosResponse} from "axios";
import {AuthService} from "../../auth/AuthService";

export default class AccountService {
  private static readonly authService = AuthService.getInstance();
  
  public static async deleteTodoAccount(id: string): Promise<AxiosResponse<void>> {
    const user = await this.authService.getUser();
    return Axios.delete(`${process.env.REACT_APP_TODO_SERVER_URL}/api/todouser/${id}`, {
      headers: {'Authorization': `${user?.token_type} ${user?.access_token}`}
    });
  }
  
  /* this is not ideal. The ideal solution is having, in the authentication server,
  * a component to let users to manage their own account.
  */ 
  public static deleteAccount(id: string): Promise<AxiosResponse<void>> {
    return Axios.delete(`${process.env.REACT_APP_AUTH_SERVER_URL}/api/user/${id}`);
  }
}
