import React, {useState} from 'react';
import './SignUp.scss';
import {
  Link
} from 'react-router-dom';
import {AxiosError} from 'axios';
import {AuthService} from '../AuthService';
import {AccountService} from '../AccountService';
import Message from '../../shared/message/Message';

const SignUp: React.FC = (): JSX.Element => {
  const [userObj, setUserObj] =
    useState(
      {
        // userName: '',
        // name: '',
        // picture: '',
        // email: '',
        // password: '',
        // confirmPassword: ''
      }
    );

  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event: any) => {
    AccountService.registerUser(userObj).then(() => {
      // this line will redirect to login component
      AuthService.getInstance().startAuthentication();
    }).catch((error: AxiosError) => {
      setErrorMessage(error.message);
    });
    event.preventDefault(); // avoids redirection on submit because of default behavior
  }

  // check spread operator and in which cases is important immutability
  return (
    <div className="container">
      <p>sign-up works!</p>
      <div>
        <div>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-fields">
              <input
                type="text"
                name="Username"
                placeholder="Username"
                onChange={
                  event => setUserObj({...userObj, userName: event.target.value})
                }
              />
              <input
                type="text"
                name="Name"
                placeholder="Name"
                onChange={
                  event => setUserObj({...userObj, name: event.target.value})
                }
              />
              <input
                type="email"
                name="Email"
                placeholder="Email"
                onChange={
                  event => setUserObj({...userObj, email: event.target.value})
                }
              />
              <input
                type="password"
                name="Password"
                placeholder="Password"
                onChange={
                  event => setUserObj({...userObj, password: event.target.value})
                }
              />
              <input
                type="password"
                name="Confirm Password"
                placeholder="Confirm Password"
                onChange={
                  event => setUserObj({...userObj, confirmPassword: event.target.value})
                }
              />
            </div>
            <button className="btn-submit" type="submit">Sign Up</button>
          </form>
        </div>
        <Message text={errorMessage} />
        <nav>
          <ul>
            <li>
              <Link to="/signin">Sign In</Link>
            </li>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default SignUp;
