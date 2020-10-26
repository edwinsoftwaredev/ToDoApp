import React, {useEffect} from 'react';
import './Home.scss';
import Menu from './menu/Menu';
import {Switch, Route} from 'react-router-dom';
import FeaturedTodos from './featured-todos/FeaturedTodos';
import Todos from './todos/Todos';
import Axios, {AxiosError, AxiosResponse} from 'axios';
import {useDispatch} from 'react-redux';
import {saveWeather} from './weather-widget/WeatherWidget';
import CompletedTodos from './completed-todos/CompletedTodos';
import {AuthService} from '../auth/AuthService';
import {ITodo} from '../shared/todo-card/TodoCard';
import {createSlice, Slice, PayloadAction, Action, createSelector} from '@reduxjs/toolkit';
import {ActionsObservable, StateObservable, ofType} from 'redux-observable';
import {RootState} from '../reducers/RootReducer';
import {map} from 'rxjs/operators';
import {User} from 'oidc-client';
import Account from "./account/Account";

// TodoUser Reducer
export interface ITodoUser {
  userId: string;
  userName: string;
  todos: ITodo[];
}

const initialTodoUser: ITodoUser = {
  userId: '',
  userName: '',
  todos: Array.of<ITodo>()
};

export const todoUserSlice: Slice<ITodoUser> = createSlice({
  name: 'todoUser',
  initialState: initialTodoUser,
  reducers: {
    setTodoUser: (state: ITodoUser, action: PayloadAction<ITodoUser>) => {
      state = action.payload;
      return state;
    }
  }
});

//TodoUser Epic
enum ActionTypes {
  SET_TODOUSER = 'todoUser/setTodoUser'
}

const setTodoUser =
  (todoUser: ITodoUser) => ({type: ActionTypes.SET_TODOUSER, payload: todoUser});

interface ISetTodoUserAction extends Action {
  type: ActionTypes.SET_TODOUSER;
  todoUser: ITodoUser;
}

export type SetTodoUserAction = ISetTodoUserAction;

export const setTodoUserEpic = (
  action$: ActionsObservable<ISetTodoUserAction>,
  state$: StateObservable<RootState>
) => action$.pipe(
  ofType<ISetTodoUserAction>(ActionTypes.SET_TODOUSER),
  map((setTodoUserAction: ISetTodoUserAction) => {
    state$.value.todoUser = setTodoUserAction.todoUser;
  }),
);

// TodoUser selector
export const todoUserSelector = createSelector(
  (state: RootState) => state.todoUser,
  (todoUser: ITodoUser) => todoUser
);

/////////////////////////////////////////////////////////////////////////////////

const Home: React.FC = (): JSX.Element => {
  const dispatch = useDispatch();

  // getting weather at startup
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position: Position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const apiKey = process.env.REACT_APP_API_WEATHER_KEY;
      Axios
        .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
        .then((response: AxiosResponse) => {
          dispatch(saveWeather({
            weatherDescription: response.data.weather[0].description,
            weatherTemperature: response.data.main.temp,
            weatherIcon: response.data.weather[0].icon
          }));
        }).catch((error: AxiosError) => {
          console.log(error.message);
        });
    }, ((posError: PositionError) => {
      console.log(posError);
    }), {enableHighAccuracy: true} as PositionOptions);
  }, [dispatch]);

  // getting/setting TodoUser at startup
  const getTodoUser = () => {
    AuthService.getInstance().getUser().then((user: User | null) => {
      if (user) {
        Axios.get(
          `${process.env.REACT_APP_TODO_SERVER_URL}/api/todouser`
          , {headers: {'Authorization': `${user?.token_type} ${user?.access_token}`}}
        ).then((response: AxiosResponse<ITodoUser>) => {
          dispatch(setTodoUser(response.data));
        });
      }
    });
  };

  useEffect(() => {
    getTodoUser();
  });

  return (
    <div className={'Home'}>
      <Menu />
      <div className='container'>
        <main className='home-main'>
          <Switch>
            <Route exact path="/">
              <div className='option-container'>
                <FeaturedTodos />
              </div>
            </Route>
            <Route exact path="/todos">
              <div className='option-container'>
                <Todos />
              </div>
            </Route>
            <Route exact path="/completed-todos">
              <div className='option-container'>
                <CompletedTodos />
              </div>
            </Route>
            <Route exact path="/account">
              <div className='option-container'>
                <Account />
              </div>
            </Route>
          </Switch>
        </main>
      </div>
    </div>
  );
}

export default Home;
