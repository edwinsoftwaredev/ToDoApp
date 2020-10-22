import React, {useState, useEffect} from 'react';
import './SignIn.scss';
import Username from '../../shared/inputs/user/username/Username';
import Password from '../../shared/inputs/user/password/Password';
import {useHistory} from 'react-router-dom';
import {AccountService} from '../AccountService';
import {AxiosError, AxiosResponse} from 'axios';
import Message from '../../shared/message/Message';
import {useQuery} from '../../shared/utils';

declare const gapi: any;
export interface IGoogleIDToken {
  id_token: string
}

const SignIn: React.FC = (): JSX.Element => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [disableForm, setDisableForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [googleIDToken, setGoogleIDToken] = useState<IGoogleIDToken>();

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
        .catch((error: AxiosError<any>) => {
          if (error.response?.status === 404) {
            setErrorMessage('Check your Username and Password.');
          } if (error.response?.status === 500) {
            setErrorMessage(error.response.data.title);
          } else if (error.response?.status !== 404 && error.response?.status !== 500) {
            setErrorMessage(error.message);
          }
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
  }, [username, password]);

  const onGoogleSignIn = (googleUser: any) => {
    const idToken = googleUser.getAuthResponse().id_token;
    setGoogleIDToken({id_token: idToken});
  }

  useEffect(() => {
    if (googleIDToken) {
      AccountService.authenticateUserWithGoogle(googleIDToken)
        .then(() => {
          history.push('/');
        })
        .catch((error: AxiosError) => {
          console.log(error.message);
        });
    }
  }, [googleIDToken, history]);

  useEffect(() => {
    const googleScript = document.createElement<'script'>('script');
    googleScript.src = 'https://apis.google.com/js/platform.js';
    googleScript.async = true;
    googleScript.defer = true;
    document.body.appendChild(googleScript);

    googleScript.onload = () => {

      gapi.load('auth2', () => {
        const googleAuth = gapi.auth2.init({
          client_id: '539369846251-q5upr5nftjdf30ruqbs2i0v45tqn96h4.apps.googleusercontent.com'
        });

        googleAuth.then(() => {
          gapi?.signin2.render('g-signin2', {
            scope: 'profile email',
            width: 'auto',
            height: 38,
            longtitle: true,
            theme: 'dark',
            onsuccess: onGoogleSignIn
          });
        })
      });
    };
  }, []);

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
        <div className='signin-providers-separator'>
          <span>- or -</span>
        </div>
        <div className='google-signin-container'>
          <div id="g-signin2">
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
