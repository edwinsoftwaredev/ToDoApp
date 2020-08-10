import React from 'react';
import './App.scss';
import {
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';
import Home from './home/Home';
import Auth from './auth/Auth';
import {AuthService} from './auth/AuthService';

function App(): JSX.Element {
  const authService = AuthService.getInstance();
  const PrivateRoute = authService.privateRoute;

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
