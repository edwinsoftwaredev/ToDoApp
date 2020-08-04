import React from 'react';
import logo from './logo.svg';
import './App.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import SignIn from './auth/sign-in/SignIn';
import SignUp from './auth/sign-up/SignUp';
import {useSelector} from 'react-redux';
import {RootState} from './store/Store';
import Home from './home/Home';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h2>{useSelector((state: RootState) => state.appName)}</h2>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/signin">
              <SignIn />
            </Route>
            <Route path="/signup">
              <SignUp />
            </Route>
          </Switch>
        </header>
      </div>
    </Router>
  );
}

export default App;
