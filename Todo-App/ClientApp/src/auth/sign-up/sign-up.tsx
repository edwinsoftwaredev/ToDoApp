import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom';
import {SignIn} from '../sign-in/sign-in';
import App from '../../App';

export class SignUp extends React.Component {
  render() {
    return (
      <Router>
        <p>sign-up works!</p>

        <Switch>
          <Route path="/signin">
            <SignIn />
          </Route>
          <Route path="/">
            <App />
          </Route>
        </Switch>
      </Router>
    );
  }
}
