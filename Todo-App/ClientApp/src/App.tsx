import React, {useEffect} from 'react';
import './App.scss';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import Home from './home/Home';
import Auth from './auth/Auth';
import {AuthService} from './auth/AuthService';
import {User as OidcUser} from 'oidc-client';
import {saveUser} from './auth/auth-codes/AuthCodes';
import {useDispatch, useSelector} from 'react-redux';
import {AccountService} from './auth/AccountService';

function AppContainer(): JSX.Element {
  const authService = AuthService.getInstance();
  const dispatch = useDispatch();
  // this hook cant be called inside a component
  // that implements Router
  const isUserLoggedIn = useSelector(AuthService.isUserLoggedInSelector);

  useEffect(() => {
    AccountService.getAntiForgeryToken().then(() => {
      const windowLocation = window.location.pathname;
      if (
        !isUserLoggedIn &&
        windowLocation !== '/authentication/signin' &&
        windowLocation !== '/authentication/signup' &&
        windowLocation !== '/authentication/signout' &&
        windowLocation !== '/auth/codes'
      ) {
        authService.getUser().then((user: OidcUser | null) => {
          if (user) {
            dispatch(saveUser(user))
          } else {
            authService.startAuthentication(); // this generates a browser redirection
          }
        });
      }
    });
  }, [authService, dispatch, isUserLoggedIn]);

  return (
    <div className="App">
      {!isUserLoggedIn ? <Auth /> : null}
      {isUserLoggedIn ? <Home /> : null}
    </div>
  );
}

function App(): JSX.Element {
  return (
    <Router>
      <AppContainer />
    </Router>
  );
}

export default App;
