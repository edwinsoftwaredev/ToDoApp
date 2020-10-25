import {combineReducers, Slice, createSlice} from '@reduxjs/toolkit';
import authSlice from '../auth/AuthSlice';
import {combineEpics, ActionsObservable, StateObservable} from 'redux-observable';
import {catchError} from 'rxjs/operators';
import {setUserEpic, SaveUserActions} from '../auth/auth-codes/AuthCodes';
import {weatherSlice, SaveWeatherAction, weatherEpic} from '../home/weather-widget/WeatherWidget';
import {todoUserSlice, SetTodoUserAction, setTodoUserEpic} from '../home/Home';

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
type Actions = SaveUserActions |
  SaveWeatherAction |
  SetTodoUserAction;

// https://redux-observable.js.org/docs/basics/Epics.html
// https://redux-observable.js.org/docs/basics/SettingUpTheMiddleware.html
export const rootEpic =
  (action$: ActionsObservable<Actions>,
    store$: StateObservable<any>
  ) => combineEpics(
    setUserEpic,
    setTodoUserEpic,
    weatherEpic
  )(action$, store$).pipe(catchError((error, source) => {
    console.log(error);
    return source;
  }));

export const rootReducer = combineReducers({
  app: initialSlice.reducer,
  oidcUser: authSlice.reducer,
  todoUser: todoUserSlice.reducer,
  weather: weatherSlice.reducer
});

export type RootState = ReturnType<typeof rootReducer>
