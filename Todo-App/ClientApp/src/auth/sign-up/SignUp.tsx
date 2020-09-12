import React, {useState, Dispatch} from 'react';
import './SignUp.scss';
import {AxiosError} from 'axios';
import {AuthService} from '../AuthService';
import {AccountService} from '../AccountService';
import Message from '../../shared/message/Message';
import Username from '../../shared/inputs/user/username/Username';
import Name from '../../shared/inputs/user/name/Name';
import Email from '../../shared/inputs/user/email/Email';
import Password from '../../shared/inputs/user/password/Password';

const SignUp: React.FC = (): JSX.Element => {

  const [userObj, setUserObj] =
    useState({});

  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event: any) => {
    // userObj must be validated
    AccountService.registerUser(userObj).then(() => {
      // redirecting to login component
      AuthService.getInstance().startAuthentication();
    }).catch((error: AxiosError) => {
      setErrorMessage(error.message);
    });
    // avoids redirection on submit because of default behavior
    event.preventDefault();
  }

  // form inputs validation states


  // check spread operator and in which cases is important immutability
  return (
    <div className="container">
      <h1 className="uk-heading-medium">TaskMan</h1>
      <div>
        <form className="form" onSubmit={e => handleSubmit(e)}>
          <div className="form-fields">
            <Username
              username={(username: string) => setUserObj({...userObj, username: username})}
            />
            <Name
              name={(name: string) => setUserObj({...userObj, name: name})}
            />
            <Email
              email={(email: string) => setUserObj({...userObj, email: email})}
            />
            <Password
              password={(password: string) => setUserObj({...userObj, password: password})}
            />
            <input
              className="uk-input"
              type="password"
              name="Confirm Password"
              required
              placeholder="Confirm Password"
              onChange={
                event => setUserObj({...userObj, confirmPassword: event.target.value})
              }
            />
          </div>
          <button className="uk-button uk-button-default" type="submit">Sign Up</button>
        </form>
      </div>
      <Message text={errorMessage} />
      <nav>
        <ul>
        </ul>
      </nav>
    </div>
  );
}

export default SignUp;
