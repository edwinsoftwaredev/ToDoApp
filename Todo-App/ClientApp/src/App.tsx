import React from 'react';
import './App.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation
} from 'react-router-dom';
import Home from './home/Home';
import Auth from './auth/Auth';
import {AuthService} from './auth/AuthService';
import {TestComponent} from './test-component/TestComponent';
import {User as OidcUser} from 'oidc-client';
import {saveUser} from './auth/auth-codes/AuthCodes';
import {useDispatch} from 'react-redux';

function AppContainer(): JSX.Element {
  const authService = AuthService.getInstance();
  const PrivateRoute = authService.privateRoute;
  const dispatch = useDispatch();

  // this hook cant be called inside a component
  // that implements Router
  const location = useLocation();

  authService.getUser().then((user: OidcUser | null) => {
    if (user) {
      dispatch(saveUser(user));
    } else {
      if (location.pathname !== '/signin' && location.pathname !== '/auth/codes') {
        authService.startAuthentication();
      }
    }
  });
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
