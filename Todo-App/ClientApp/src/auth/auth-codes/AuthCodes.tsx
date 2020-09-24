import React, {useState} from 'react';
import {AuthService} from '../AuthService';
import {User as OidcUser} from 'oidc-client';
import authSlice from '../AuthSlice';
import Message from '../../shared/message/Message';
import {AxiosError} from 'axios';
import {useHistory} from 'react-router-dom';

const AuthCodes: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('');

  const history = useHistory();
  // here this is redirecting to home -> '/'
  // but it has to be a previous route before authentication page
  // that route has to be saved and retrived in the following function.
  const handlePreviousRoute = () => history.push('/');

  const authService = AuthService.getInstance();
  authService.completeAuthentication().then((user: OidcUser | void) => {
    if (user) {
      authSlice.actions.identifyUser(user);
      handlePreviousRoute();
    }
  }).catch((error: AxiosError) => {
    setErrorMessage(error.message);
  });

  return (
    <Message text={errorMessage} />
  );
}

export default AuthCodes;
