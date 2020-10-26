import React, {useState, useEffect} from 'react';
import Message from '../../shared/message/Message';
import {AccountService} from "../AccountService";
import {AxiosResponse} from "axios";

declare const gapi: any;
const SignOut: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [googleScriptsLoaded, setGoogleScriptsLoaded] = useState(false);
  const [signedOutWithGoogle, setSignedOutWithGoogle] = useState(false);
  
  const loadGoogleScripts = () => {
    const googleScript = document.createElement<'script'>('script');
    googleScript.src = 'https://apis.google.com/js/platform.js';
    googleScript.async = true;
    googleScript.defer = true;
    document.body.appendChild(googleScript);
    
    googleScript.onload = () => {
      setGoogleScriptsLoaded(true);
    }
  }
  
  const signOutGoogle = () => {
    gapi.load('auth2', () => {
      const googleAuth = gapi.auth2.init({
        client_id: '539369846251-q5upr5nftjdf30ruqbs2i0v45tqn96h4.apps.googleusercontent.com'
      });

      googleAuth.then(() => {
        const auth2 = gapi?.auth2.getAuthInstance();
        auth2.signOut().then(() => {
          setSignedOutWithGoogle(true);
        });
      })
    });
  };
  
  const signOut = () => {
    AccountService.getAntiForgeryToken().then(() => {

      const params = new URLSearchParams(window.location.search);
      let logoutId = '';
      if (params.get('logoutId')) logoutId = params.get('logoutId') as string;

      AccountService.deleteAuthCookie(logoutId).then((response: AxiosResponse<string>) => {
        // check if user is signed out from external IdP
        console.log('User signed out');
        if (response.data) {
          window.location.href = response.data;
        } else {
          setErrorMessage('Invalid redirection URL.');
        }
      });
    })
  }

  useEffect(() => {
    // add more checks for other external authentications
    if (googleScriptsLoaded) {
      signOutGoogle();
    } else {
      loadGoogleScripts();  
    }
    
    // add more checks for other external authentications
    if (signedOutWithGoogle) {
      signOut();
    }
  }, [googleScriptsLoaded, signedOutWithGoogle]);

  return (
    <div>
      <Message text={errorMessage} />
    </div>
  );
}

export default SignOut;
