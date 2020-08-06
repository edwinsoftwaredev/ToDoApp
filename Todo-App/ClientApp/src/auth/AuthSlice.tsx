import {Slice, createSlice} from '@reduxjs/toolkit';
import {User as OidcUser} from 'oidc-client';
import {userManager} from '../auth/Auth';

// return the authenticatedUser, if there isnt then return a empty object
const authenticatedUser = ((): OidcUser | {} => {
  let user: OidcUser | null = null;

  // The getUser method doesnt make an api request
  // however it returns a promise
  userManager.getUser().then((usr: OidcUser | null) => {
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
