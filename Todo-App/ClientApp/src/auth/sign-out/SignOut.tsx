import React, {useState, useEffect} from 'react';
import {AuthService} from '../AuthService';
import Message from '../../shared/message/Message';
import {useHistory} from 'react-router-dom';
import {AxiosError} from 'axios';
import {useDispatch} from 'react-redux';
import {saveUser} from '../auth-codes/AuthCodes';

declare const gapi: any;
const SignOut: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [signOutWithGoogle, setSignOutWithGoogle] = useState(false);

  const authService = AuthService.getInstance();
  const history = useHistory();
  const dispatch = useDispatch();

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
          const auth2 = gapi?.auth2.getAuthInstance();
          auth2.signOut().then(() => {
            setSignOutWithGoogle(true);
          });
        })
      });
    };
  }, []);

  useEffect(() => {
    authService.completeSignOut().then(() => {
      // and others
      if (signOutWithGoogle) {
        console.log('User signed out');
        dispatch(saveUser({}));
        // history.push('/') wont reload App.tsx component
        history.push('/'); // should redirects to other route
      }
    }).catch((error: AxiosError) => {
      setErrorMessage(error.message);
    });
  }, [authService, dispatch, history, signOutWithGoogle])

  return (
    <div>
      <Message text={errorMessage} />
    </div>
  );
}

export default SignOut;
