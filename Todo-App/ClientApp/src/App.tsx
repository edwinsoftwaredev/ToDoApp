import React, {useEffect} from 'react';
import './App.scss';
import {
  BrowserRouter as Router,
  Switch,
  useLocation,
} from 'react-router-dom';
import Home from './home/Home';
import Auth from './auth/Auth';
import {AuthService} from './auth/AuthService';
import {User as OidcUser} from 'oidc-client';
import {saveUser} from './auth/auth-codes/AuthCodes';
import {useDispatch, useSelector} from 'react-redux';

function AppContainer(): JSX.Element {
  const authService = AuthService.getInstance();
  const PrivateRoute = authService.privateRoute;
  const dispatch = useDispatch();
  // this hook cant be called inside a component
  // that implements Router
  const location = useLocation();
  const isUserLoggedIn = useSelector(AuthService.isUserLoggedInSelector);

  useEffect(() => {
    if (
      location.pathname !== '/signin' &&
      location.pathname !== '/auth/codes' &&
      !isUserLoggedIn
    ) {
      authService.getUser().then((user: OidcUser | null) => {
        if (user) {
          dispatch(saveUser(user));
        } else {
          authService.startAuthentication();
        }
      });
    }
  }, [authService, dispatch, isUserLoggedIn, location.pathname]);

  return (
    <div className="App">
      <Switch>
        <PrivateRoute exact path="/">
          <Home />
        </PrivateRoute>
        <Auth />
        {/*<Route path='/'>
            <TestComponent />
          </Route>*/}
      </Switch>
      {/*<header className="App-header">
        </header>*/}
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
