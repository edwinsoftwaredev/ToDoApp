import Axios from 'axios';

export class AccountService {
  /**
   * Registers a new user
   * @return {Promise<void>}
   */
  public static registerUser(userObj: object): Promise<void> {
    return Axios.post(`${process.env.REACT_APP_API_SERVER_URL}api/user`, userObj);
  }

  /**
   * Deletes a user. Only authenticated user are able to delete their own accout.
   */
  public static deleteUser(userName: string): Promise<void> {
    return Axios.delete(`${process.env.REACT_APP_API_SERVER_URL}api/user?id=${userName}`);
  }
}
