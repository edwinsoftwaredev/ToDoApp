import React, {useState, Dispatch} from 'react';
import './Username.scss';
import Message from '../../../message/Message';

const validate = (
  username: string,
  setUsernameErrorMessage: Dispatch<React.SetStateAction<string>>,
): boolean => {
  if (!username) {
    setUsernameErrorMessage('Username is required');
    return false;
  } else {
    setUsernameErrorMessage('');
    return true;
  }
}

const Username: React.FC<IUsername> = (props: IUsername) => {
  const [username, setUsername] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState('');

  const usernameHandler = (username: string) => {
    setIsTouched(true);
    setIsValid(validate(username, setUsernameErrorMessage));
    isValid ? setUsername(username) : setUsername('');
    props.username(username);
  };

  return (
    <div
      className="username-input"
    >
      <input
        className="uk-input"
        type="text"
        name="Username"
        placeholder="Username"
        autoComplete={"off"}
        required
        minLength={6}
        maxLength={18}
        pattern="^[_.@A-Za-z0-9-]+$"
        onChange={
          event => usernameHandler(event.target.value)
        }
      />
      <Message text={usernameErrorMessage} />
    </div>
  );
}

export interface IUsername {
  username: (username: string) => void;
}

export default Username;
