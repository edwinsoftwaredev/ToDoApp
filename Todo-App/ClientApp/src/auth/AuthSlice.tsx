import {Slice, createSlice} from '@reduxjs/toolkit';
import {User as OidcUser, UserManagerSettings, UserManager} from 'oidc-client';

const userManagerSettings: UserManagerSettings = {
  authority: process.env.REACT_APP_API_SERVER_URL,
  client_id: 'TodoAppFirstPartyUser',
  redirect_uri: process.env.REACT_APP_REDIRECT_URI,
  response_type: 'code',
  scope: 'openid profile TodoAppApi.TodoAppUser',
  popup_redirect_uri: process.env.REACT_APP_REDIRECT_LOGOUT
};

const userManager: UserManager = new UserManager(userManagerSettings);

// return the authenticatedUser, if there isnt then return a empty object
const authenticatedUser = ((): OidcUser | {} => {
  let user: OidcUser | null = null;
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
