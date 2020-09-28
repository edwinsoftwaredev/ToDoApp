import React, {useState, useEffect} from 'react';
import {AuthService} from '../AuthService';
import {User as OidcUser} from 'oidc-client';
import Message from '../../shared/message/Message';
import {AxiosError} from 'axios';
import {useHistory} from 'react-router-dom';
import {ActionsObservable, ofType, StateObservable} from 'redux-observable';
import {Action} from '@reduxjs/toolkit';
import {map} from 'rxjs/operators';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../reducers/RootReducer';

enum ActionTypes {
  SAVE_USER = 'oidcUser/identifyUser', // this is the name of the Action in the slice
};

export const saveUser = (user: OidcUser) => ({type: ActionTypes.SAVE_USER, payload: user});

interface ISaveUser extends Action {
  type: ActionTypes.SAVE_USER
  user: OidcUser
}

export const setUserEpic = (
  action$: ActionsObservable<ISaveUser>,
  state$: StateObservable<RootState>,
) => action$.pipe(
  ofType<ISaveUser>(ActionTypes.SAVE_USER),
  map((userAction: ISaveUser) => {
    state$.value.oidcUser = userAction.user
  }),
);

export type SaveUserActions = ISaveUser;

const AuthCodes: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('');

  const history = useHistory();
  // here this is redirecting to home -> '/'
  // but it has to be a previous route before authentication page
  // that route has to be saved and retrived in the following function.
  const handlePreviousRoute = () => history.push('/');
  const authService = AuthService.getInstance();
  const dispatch = useDispatch();

  const isUserLoggedIn = useSelector(AuthService.isUserLoggedInSelector);
  authService.completeAuthentication().then((user: OidcUser | void) => {
    if (user) {
      setErrorMessage('');
      dispatch(saveUser(user));
    }
  }).catch((error: AxiosError) => {
    setErrorMessage(error.message);
  });

  useEffect(() => {
    if (isUserLoggedIn) {
      handlePreviousRoute();
    }
  }, [handlePreviousRoute, isUserLoggedIn]);

  return (
    <Message text={errorMessage} />
  );
}

export default AuthCodes;
