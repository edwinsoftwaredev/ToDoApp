import Axios, {AxiosResponse, AxiosRequestConfig} from 'axios';
import {IGoogleIDToken} from './sign-in/SignIn';

export class AccountService {

  private static _xsrfInterceptorId: number;

  /**
   * Registers a new user
   * @return {Promise<void>}
   */
  public static registerUser(userObj: object): Promise<void> {

    return Axios.post(
      `${process.env.REACT_APP_API_SERVER_URL}/api/user`,
      userObj
    );
  }

  /**
   * Login a user
   * @return {Promise<void>}
   */
  public static authenticateUser(loginData: any): Promise<AxiosResponse<any>> {
    return Axios.post(
      `${process.env.REACT_APP_API_SERVER_URL}/api/authentication/signin`,
      loginData
    );
  }

  /**
   * signed in a user using google sign in
   */
  public static authenticateUserWithGoogle(idToken: IGoogleIDToken): Promise<AxiosResponse<any>> {
    return Axios.post(
      `${process.env.REACT_APP_API_SERVER_URL}/api/authentication/signin-google`,
      idToken
    );
  }

  /**
   * makes a request to delete authentication cookie
   * @returns {Promise<void>}
   */
  public static deleteAuthCookie(): Promise<void> {
    return Axios.post(
      `${process.env.REACT_APP_API_SERVER_URL}/api/authentication/signout`
    );
  }

  /**
   * Deletes a user. Only authenticated user are able to delete their own accout.
   */
  public static deleteUser(userName: string): Promise<void> {
    return Axios.delete(
      `${process.env.REACT_APP_API_SERVER_URL}/api/user?id=${userName}`
    );
  }

  /**
   * Makes a request to get csrf token and add an interceptor to add
   * a X-XSRF-TOKEN on every request
   */
  public static async getAntiForgeryToken(): Promise<void> {
    return Axios.get(`${process.env.REACT_APP_API_SERVER_URL}/api/xsrftoken`)
      .then((response: AxiosResponse) => {

        const headerName = response.config.xsrfHeaderName;

        // here this will get the xcsrfCookie
        if (headerName) {
          const xcsrfCookie = document
            .cookie
            .split('; ')
            .find(cookie => cookie.startsWith(headerName))
            ?.split('=')[1];

          if (xcsrfCookie) {
            // here this will set the cookie
            window.sessionStorage.setItem(headerName, xcsrfCookie);
            window.sessionStorage.setItem('csrf-token-headername', headerName);
          }
        }

        Axios.interceptors.request.eject(this._xsrfInterceptorId);

        this._xsrfInterceptorId = Axios.interceptors.request.use((request: AxiosRequestConfig) => {
          const xcsrfHeaderName = window.sessionStorage.getItem('csrf-token-headername');

          if (!xcsrfHeaderName) return request;

          const xcsrfToken = window.sessionStorage.getItem(xcsrfHeaderName);

          if (!xcsrfToken) return request;

          if (request.url?.includes('https://api.openweathermap.org')) return request;

          request.headers[xcsrfHeaderName] = xcsrfToken;
          return request;
        });
      });
  }
}
