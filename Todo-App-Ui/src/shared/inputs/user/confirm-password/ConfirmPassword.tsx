import React from 'react';
import ValidatedTextInput from '../../validated-input/ValidatedTextInput';
import './ConfirmPassword.scss';

const validate = (
  value: string,
  setMessage: (message: string) => void
): boolean => {
  if (!value) {
    setMessage('is required');
    return false;
  } else {
    setMessage('');
    return true;
  }
};

const ConfirmPassword: React.FC<IConfirmPassword> = (props: IConfirmPassword) => {
  const valueHandler = (value: string) => {
    props.confirmPassword(value);
  };

  return (
    <ValidatedTextInput
      name='Confirm Password'
      isValid={validate}
      value={valueHandler}
      others={{
        type: 'password'
      }}
    />
  );
}

export interface IConfirmPassword {
  confirmPassword: (confirmPassword: string) => void;
}

export default ConfirmPassword;
