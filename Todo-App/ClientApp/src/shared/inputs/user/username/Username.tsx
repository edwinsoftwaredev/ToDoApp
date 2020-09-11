import React from 'react';
import ValidatedTextInput from '../../validated-input/ValidatedTextInput';
import './Username.scss';

const validate = (
  value: string,
  setMessage: (message: string) => void
): boolean => {
  const usernameregexPatt = new RegExp('^[_.@A-Za-z0-9-]+$');
  if (!value) {
    setMessage('is required');
    return false;
  } if (!usernameregexPatt.test(value)) {
    setMessage('must include either letters, numbers or the following characters _.@');
    return false;
  } else {
    setMessage('');
    return true;
  }
}

const Username: React.FC<IUsername> = (props: IUsername) => {
  const usernameHandler = (value: string) => {
    props.username(value);
  };

  return (
    <div>
      <ValidatedTextInput
        name='Username'
        value={(value: string) => usernameHandler(value)}
        isValid={validate}
        others={{maxLength: 20, minLength: 6, autoComplete: 'off'}} />
    </div>
  );
}

export interface IUsername {
  username: (username: string) => void;
}

export default Username;
