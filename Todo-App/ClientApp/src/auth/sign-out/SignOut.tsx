import React, {useState, useEffect} from 'react';
import {AuthService} from '../AuthService';
import Message from '../../shared/message/Message';
import {useHistory} from 'react-router-dom';
import {AxiosError} from 'axios';

const SignOut: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('');

  const authService = AuthService.getInstance();
  const history = useHistory();

  useEffect(() => {
    authService.completeSignOut().then(() => {
      history.push('/'); // should redirects to other route
    }).catch((error: AxiosError) => {
      setErrorMessage(error.message);
    });
  }, [authService, history])

  return (
    <div>
      <Message text={errorMessage} />
    </div>
  );
}

export default SignOut;
