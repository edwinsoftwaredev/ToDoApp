import {Slice, createSlice} from '@reduxjs/toolkit';
import {User as OidcUser} from 'oidc-client';
import {AuthService} from './AuthService';

// return the authenticatedUser, if there isnt then return a empty object
const authenticatedUser = ((): OidcUser | {} => {
  let user: OidcUser | null = null;
  const authService = AuthService.getInstance();

  // The getUser method doesnt make an api request
  // however it returns a promise
  authService.getUser().then((usr: OidcUser | null) => {
    user = usr;
  });

  return user ? user : {};
})();

const authSlice: Slice<OidcUser | {}> = createSlice({
  name: 'oidcUser',
  initialState: authenticatedUser,
  reducers: {
    identifyUser: (state: OidcUser | {}) => {
      state = authenticatedUser;
    }
  }
});

export default authSlice;
