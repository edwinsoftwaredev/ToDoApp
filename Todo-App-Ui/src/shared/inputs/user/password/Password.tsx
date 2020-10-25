import React from 'react';
import ValidatedTextInput from '../../validated-input/ValidatedTextInput';
import '../../validated-input/ValidatedTextInput.scss';

const validated = (
  value: string,
  setMessage: (message: string) => void
): boolean => {
  const passwordRegex =
    new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,20})/);

  if (!passwordRegex.test(value)) {
    const passwordErrorMessage = 'must be a combination of at least:' +
      ' 1 uppercase letter,' +
      ' 1 lowercase letter,' +
      ' 1 of the following characters !@#$%^&* ,' +
      ' 1 number' +
      ' and be between 6 and 20 characters long';
    setMessage(passwordErrorMessage);
    return false;
  }

  if (!value) {
    setMessage('is required');
    return false;
  }

  setMessage('');
  return true;
}

const Password: React.FC<IPassword> = (props: IPassword) => {
  const valueHandler = (value: string) => {
    props.password(value);
  };

  return (
    <div>
      <ValidatedTextInput
        name='Password'
        isValid={validated}
        value={valueHandler}
        others={{
          type: 'password',
          autoComplete: 'off'
        }}
      />
    </div>
  );
}

export interface IPassword {
  password: (password: string) => void;
}

export default Password;
