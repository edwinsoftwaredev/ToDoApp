import React, {useState, Dispatch} from 'react';
import './Username.scss';
import Message from '../../../message/Message';

const validate = (
  username: string,
  setUsernameErrorMessage: Dispatch<React.SetStateAction<string>>,
): boolean => {
  const usernameregexPatt = new RegExp('^[_.@A-Za-z0-9-]+$');
  if (!username) {
    setUsernameErrorMessage('Username is required');
    return false;
  } if (!usernameregexPatt.test(username)) {
    setUsernameErrorMessage('Username must include letters, numbers or the following characters _.@');
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
      className="username-inputfield"
    >
      <div
        className={"username-info-tab" + (!isValid && !isTouched ? "" : isValid && !usernameErrorMessage ? " valid" : " not-valid")}>
        <div className="username-label">{'Username' + (usernameErrorMessage.replace('Username', ''))}</div>
      </div>
      <input
        className="uk-input username-input"
        type="text"
        name="Username"
        autoComplete={"off"}
        required
        minLength={6}
        maxLength={18}
        onChange={
          event => usernameHandler(event.target.value)
        }
      />
    </div>
  );
}

export interface IUsername {
  username: (username: string) => void;
}

export default Username;
