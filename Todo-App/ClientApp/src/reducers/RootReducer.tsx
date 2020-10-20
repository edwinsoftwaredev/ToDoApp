import {combineReducers, Slice, createSlice} from '@reduxjs/toolkit';
import authSlice from '../auth/AuthSlice';
import {combineEpics, ActionsObservable, StateObservable} from 'redux-observable';
import {catchError} from 'rxjs/operators';
import {setUserEpic, SaveUserActions} from '../auth/auth-codes/AuthCodes';
import {testSlice, TestComponentActions, valueEpic} from '../test-component/TestComponent';
import {weatherSlice, SaveWeatherAction, weatherEpic} from '../home/weather-widget/WeatherWidget';

interface IAppInitialState {
  appName: string;
}

const initialSlice: Slice<IAppInitialState> = createSlice({
  name: 'app',
  initialState: {
    appName: 'Todo App',
  } as IAppInitialState,
  reducers: {
    // no reducers
  }
});

// SaveUserActions | others...
type Actions = SaveUserActions | SaveWeatherAction | TestComponentActions;

// https://redux-observable.js.org/docs/basics/Epics.html
// https://redux-observable.js.org/docs/basics/SettingUpTheMiddleware.html
export const rootEpic =
  (action$: ActionsObservable<Actions>,
    store$: StateObservable<any>
  ) => combineEpics(
    setUserEpic,
    weatherEpic,
    valueEpic
  )(action$, store$).pipe(catchError((error, source) => {
    console.log(error);
    return source;
  }));

export const rootReducer = combineReducers({
  app: initialSlice.reducer,
  oidcUser: authSlice.reducer,
  weather: weatherSlice.reducer,
  testState: testSlice.reducer
});

export type RootState = ReturnType<typeof rootReducer>
