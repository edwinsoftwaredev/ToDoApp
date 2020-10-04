import React, {useState, useEffect} from 'react';
import './SignIn.scss';
import Username from '../../shared/inputs/user/username/Username';
import Password from '../../shared/inputs/user/password/Password';
import {useHistory} from 'react-router-dom';
import {AccountService} from '../AccountService';
import {AxiosError, AxiosResponse} from 'axios';
import Message from '../../shared/message/Message';
import {useQuery} from '../../shared/utils';

const SignIn: React.FC = (): JSX.Element => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [disableForm, setDisableForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const history = useHistory();
  const handleRoute = () => history.push('/authentication/signup');
  const returnUrl = useQuery().get('returnUrl');

  const handleSubmit = (event: any) => {
    if (!disableForm) {
      AccountService.authenticateUser({
        username: username,
        password: password,
        returnUrl: returnUrl
      })
        .then((result: AxiosResponse<any>) => {
          // after login this has to call redirects to auth-callback
          window.location.assign(result.data.redirectUrl);
        })
        .catch((error: AxiosError) => {
          setErrorMessage(error.message);
        });
    }

    event.preventDefault();
  };

  useEffect(() => {
    // here loginData is evaluated to check if it
    // contains username and password.
    setDisableForm(
      !(username
        && password
      ));
  }, [disableForm, username, password])

  return (
    <div className='signin'>
      <form className='form' onSubmit={e => disableForm ? null : handleSubmit(e)}>
        <div className='form-fields'>
          <Username
            username={(username: string) => setUsername(username)}
          />
          <Password
            password={(password: string) => setPassword(password)}
          />
        </div>
        <Message text={errorMessage} />
        <button
          className={'uk-button uk-button-default btn-submit' + (disableForm ? ' disabled' : ' enabled')}
          type={disableForm ? 'button' : 'submit'}
          disabled={disableForm}>
          Sign In
          </button>
        <button
          className={'uk-button uk-button-default btn-route-link'}
          type={'button'}
          onClick={handleRoute}
        >
          Sign Up
          </button>
      </form>
    </div>
  );
};

export default SignIn;
