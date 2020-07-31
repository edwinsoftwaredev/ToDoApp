import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom';
import App from '../../App';
import {SignUp} from '../sign-up/sign-up';

export class SignIn extends React.Component {
  render() {
    return (
      <Router>
        <p>sign-in works!</p>

        <div>
          <nav></nav>
        </div>

        <Switch>
          <Route path="/">
            <App />
          </Route>
          <Route path="/signup">
            <SignUp />
          </Route>
        </Switch>
      </Router>
    );
  }
}

