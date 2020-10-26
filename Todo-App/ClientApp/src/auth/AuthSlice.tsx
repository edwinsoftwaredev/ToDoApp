import {Slice, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {User as OidcUser} from 'oidc-client';

const authSlice: Slice<OidcUser | {}> = createSlice({
  name: 'oidcUser',
  initialState: {},
  reducers: {
    identifyUser: (state: OidcUser | {}, action: PayloadAction<OidcUser>) => {
      state = action.payload;
      return state;
    }
  }
});

export default authSlice;
