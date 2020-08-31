import React, {useState} from 'react';
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
      console.log('XXX');
      AuthService.getInstance().startAuthentication();
    }).catch((error: AxiosError) => {
      setErrorMessage(error.message);
    });
    event.preventDefault(); // avoids redirection in submit because of default behavior
  }

  // check spread operator and in which cases is important immutability
  return (
    <div>
      <p>sign-up works!</p>
      <div>
        <div>
          <form onSubmit={handleSubmit}>
            <label>
              Username:
              <input
                type="text"
                name="Username"
                onChange={
                  event => setUserObj({...userObj, userName: event.target.value})
                }
              />
            </label>
            <button type="submit">Sign Up</button>
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
