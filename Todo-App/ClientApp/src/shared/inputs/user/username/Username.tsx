import React, {useState, Dispatch} from 'react';
import ValidatedTextInput from '../../validated-input/text';
import './Username.scss';

const validate = (
  username: string,
  setUsernameErrorMessage: Dispatch<React.SetStateAction<string>>,
): boolean => {
  const usernameregexPatt = new RegExp('^[_.@A-Za-z0-9-]+$');
  if (!username) {
    setUsernameErrorMessage('is required');
    return false;
  } if (!usernameregexPatt.test(username)) {
    setUsernameErrorMessage('must include either letters, numbers or the following characters _.@');
    return false;
  } else {
    setUsernameErrorMessage('');
    return true;
  }
}

const Username: React.FC<IUsername> = (props: IUsername) => {
  const [username, setUsername] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState('');

  const usernameHandler = (username: string) => {
    setIsValid(validate(username, setUsernameErrorMessage));
    isValid ? setUsername(username) : setUsername('');
    props.username(username);
  };

  return (
    <div>
      <ValidatedTextInput
        name='Username'
        value={(value: string) => usernameHandler(value)}
        isValid={isValid}
        message={usernameErrorMessage}
        others={{maxLength: 20, minLength: 6, autocomplete: 'off'}} />
    </div>
  );
}

export interface IUsername {
  username: (username: string) => void;
}

export default Username;
