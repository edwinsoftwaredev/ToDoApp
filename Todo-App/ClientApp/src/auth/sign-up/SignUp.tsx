import React, {useState, Dispatch} from 'react';
import './SignUp.scss';
import {AxiosError} from 'axios';
import {AuthService} from '../AuthService';
import {AccountService} from '../AccountService';
import Message from '../../shared/message/Message';
import Username from '../../shared/inputs/user/username/Username';
import Name from '../../shared/inputs/user/name/Name';
import Email from '../../shared/inputs/user/email/Email';

const passwordHandler = (
  password: string,
  setPasswordErrorMessage: Dispatch<React.SetStateAction<string>>,
  userObj: object,
  setUserObj: Dispatch<React.SetStateAction<{}>>
) => {
  if (!password) {
    setPasswordErrorMessage('Password is required');
  } else {
    setUserObj({...userObj, password: password});
    setPasswordErrorMessage('');
  }
}

const confirmPasswordHandler = (
  confirmPassword: string,
  setConfirmPasswordErrorMessage: Dispatch<React.SetStateAction<string>>,
) => {
  if (!confirmPassword) {
    setConfirmPasswordErrorMessage('Confirm Password is required');
  } else {
    setConfirmPasswordErrorMessage('');
  }
}

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
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');

  const passwordRegex =
    new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,60})');

  const passwordChangeHandler = (password: string) => {
    if (!passwordRegex.test(password) && password) {
      setPasswordErrorMessage('Password must match the pattern');
    } else {
      setPasswordErrorMessage('');
    }
  };

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
            <input
              className="uk-input"
              type="password"
              name="Password"
              placeholder="Password"
              onChange={event => passwordChangeHandler(event.target.value)}
              required
            />
            <Message text={passwordErrorMessage} />
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
