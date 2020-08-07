import React, {useEffect} from 'react';
import './App.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Home from './home/Home';
import Auth, {startAuthentication, isUserLoggedInSelector} from './auth/Auth';
import {useSelector} from 'react-redux';

const PrivateRoute = ({children, ...rest}: any): JSX.Element => {
  const routeHome = (
    <Route {...rest} render={() => (children)} />
  );

  // useSelector is a Hook and in StrictMode it is called twice in fact is not the hook which
  // is called twice but the reducer wrapped by the hook.
  // This is the normal behavior of React in developement mode which helps the developer to
  // check if there is an unexpected side effect.
  // To avoid unexpected side effects the reducer must be pure <-- just values not calculated values.
  const isUserLoggedIn: boolean = useSelector(isUserLoggedInSelector);

  useEffect(() => {
    if (!isUserLoggedIn) {
      startAuthentication();
    }
  }, [isUserLoggedIn]);

  return isUserLoggedIn ? routeHome : (<div><h3>You are not logged in.<br />😅</h3></div>);
};

function App(): JSX.Element {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Switch>
            <PrivateRoute exact path="/">
              <Home />
            </PrivateRoute>
            <Auth />
          </Switch>
        </header>
      </div>
    </Router>
  );
}

export default App;
