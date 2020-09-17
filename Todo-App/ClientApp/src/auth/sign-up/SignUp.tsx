import React, {useState, useEffect} from 'react';
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

  const [userObj, setUserObj] = useState({});
  const [disableForm, setDisableForm] = useState(true);

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

  useEffect(() => {
    setDisableForm(
      !((userObj as any).username
        && (userObj as any).name
        && (userObj as any).email
        && (userObj as any).password
      ));
  }, [userObj]);

  // check spread operator and in which cases is important immutability
  return (
    <div className='container'>
      <h1 className='uk-heading-medium'>TaskMan</h1>
      <div>
        <form className='form' onSubmit={e => disableForm ? null : handleSubmit(e)}>
          <div className='form-fields'>
            <Email
              email={(email: string) => setUserObj({...userObj, email: email})}
            />
            <Name
              name={(name: string) => setUserObj({...userObj, name: name})}
            />
            <Username
              username={(username: string) => setUserObj({...userObj, username: username})}
            />
            <Password
              password={(password: string) => setUserObj({...userObj, password: password})}
            />
          </div>
          <Message text={errorMessage} />
          <button
            className={'uk-button uk-button-default btn-submit' + (disableForm ? '' : ' enabled')}
            type={disableForm ? 'button' : 'submit'}
            disabled={disableForm}>
            Sign Up
          </button>
        </form>
      </div>
      <nav>
        <ul>
        </ul>
      </nav>
    </div>
  );
}

export default SignUp;
