import React from 'react';
import {Switch, Route} from 'react-router-dom';
import SignIn from './sign-in/SignIn';
import SignUp from './sign-up/SignUp';

const Auth: React.FC = (): JSX.Element => {
  return (
    <Switch>
      <Route path="/signin" children={<SignIn />} />
      <Route path="/signup">
        <SignUp />
      </Route>
    </Switch>
  );
}

export default Auth;
