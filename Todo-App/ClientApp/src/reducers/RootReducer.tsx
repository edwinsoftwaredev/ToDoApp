import {combineReducers, Slice, createSlice} from '@reduxjs/toolkit';
import authSlice from '../auth/authSlice';

interface IAppInitialState {
  appName: string;
}

const initialSlice: Slice<IAppInitialState> = createSlice({
  name: 'app',
  initialState: {
    appName: 'TodoApp',
  } as IAppInitialState,
  reducers: {
    // no reducers
  }
});

export const rootReducer = combineReducers({
  app: initialSlice.reducer,
  oidcUser: authSlice.reducer
});

export type RootState = ReturnType<typeof rootReducer>
