import React, {useState, useEffect} from 'react';
import {AuthService} from '../AuthService';
import {User as OidcUser} from 'oidc-client';
import Message from '../../shared/message/Message';
import {AxiosError} from 'axios';
import {ActionsObservable, ofType, StateObservable} from 'redux-observable';
import {Action} from '@reduxjs/toolkit';
import {map} from 'rxjs/operators';
import {useDispatch} from 'react-redux';
import {RootState} from '../../reducers/RootReducer';
import {useHistory} from 'react-router-dom';

enum ActionTypes {
  SAVE_USER = 'oidcUser/identifyUser', // this is the name of the Action in the slice
};

export const saveUser = (user: OidcUser | {}) => ({type: ActionTypes.SAVE_USER, payload: user});

interface ISaveUser extends Action {
  type: ActionTypes.SAVE_USER
  user: OidcUser | {}
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

  const authService = AuthService.getInstance();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    authService.completeAuthentication().then((user: OidcUser | void) => {
      if (user) {
        setErrorMessage('');
        dispatch(saveUser(user));
        history.push('/') // <-- push to Home component
      }
    }).catch((error: AxiosError) => {
      setErrorMessage(error.message);
    });
  }, [authService, dispatch, history]);

  return (
    <Message text={errorMessage} />
  );
}

export default AuthCodes;
