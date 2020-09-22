import React, {useState, useEffect} from 'react';
import './SignIn.scss';
import Username from '../../shared/inputs/user/username/Username';
import Password from '../../shared/inputs/user/password/Password';
import {useHistory} from 'react-router-dom';
import {AccountService} from '../AccountService';
import {AxiosError} from 'axios';
import Message from '../../shared/message/Message';

const SignIn: React.FC = (): JSX.Element => {
  const [loginData, setLoginData] = useState({});
  const [disableForm, setDisableForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event: any) => {
    if (!disableForm) {
      AccountService.authenticateUser(loginData)
        .then(() => {
          // after login this has to something
        })
        .catch((error: AxiosError) => {
          setErrorMessage(error.message);
        });
    }

    event.preventDefault();
  };

  const history = useHistory();

  const handleRoute = () => history.push('/signup');

  useEffect(() => {
    // here loginData is evaluated to check if it
    // contains username and password.
    setDisableForm(
      !((loginData as any).username
        && (loginData as any).password
      ));
  }, [loginData])

  return (
    <div className='signin'>
      <form className='form' onSubmit={e => disableForm ? null : handleSubmit(e)}>
        <div className='form-fields'>
          <Username
            username={(username: string) => setLoginData({...loginData, username: username})}
          />
          <Password
            password={(password: string) => setLoginData({...loginData, password: password})}
          />
        </div>
        <Message text={errorMessage} />
        <button
          className={'uk-button uk-button-default btn-submit' + (disableForm ? '' : ' enabled')}
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
