import React from 'react';
import ValidatedTextInput from '../../validated-input/ValidatedTextInput';
import '../../validated-input/ValidatedTextInput.scss';

const validated = (
  value: string,
  setMessage: (message: string) => void
): boolean => {
  if (!value) {
    setMessage('is required');
    return false;
  }

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
          type: 'password'
        }}
      />
    </div>
  );
}

export interface IPassword {
  password: (password: string) => void;
}

export default Password;
