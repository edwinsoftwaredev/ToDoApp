import React, {useState, Dispatch} from 'react';
import './SignUp.scss';
import {AxiosError} from 'axios';
import {AuthService} from '../AuthService';
import {AccountService} from '../AccountService';
import Message from '../../shared/message/Message';
import Username from '../../shared/inputs/user/username/Username';

const nameHandler = (
  name: string,
  setNameErrorMessage: Dispatch<React.SetStateAction<string>>,
  userObj: object,
  setUserObj: Dispatch<React.SetStateAction<{}>>
) => {
  if (!name) {
    setNameErrorMessage('Name is required');
  } else {
    setUserObj({...userObj, name: name});
    setNameErrorMessage('');
  }
}

const emailHandler = (
  email: string,
  setEmailErrorMessage: Dispatch<React.SetStateAction<string>>,
  userObj: object,
  setUserObj: Dispatch<React.SetStateAction<{}>>
) => {
  if (!email) {
    setEmailErrorMessage('Email is required');
  } else {
    setUserObj({...userObj, email: email});
    setEmailErrorMessage('');
  }
}

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
  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
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
            <input
              className="uk-input"
              type="text"
              name="Name"
              placeholder="Name"
              required
              pattern="^[_.@A-Za-z0-9-]+$"
              maxLength={200}
              onChange={
                event => nameHandler
                  (
                    event.target.value,
                    setNameErrorMessage,
                    userObj,
                    setUserObj
                  )
              }
            />
            <input
              className="uk-input"
              type="email"
              name="Email"
              autoComplete={"off"}
              required
              placeholder="Email"
              onChange={
                event => setUserObj({...userObj, email: event.target.value})
              }
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
