import React from 'react';
import ValidatedTextInput from '../../validated-input/ValidatedTextInput';
import './Email.scss';

const validate =
  (value: string, setMessage: (message: string) => void): boolean => {
    const emailRegexp = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    if (!value) {
      setMessage('is required');
      return false;
    } else if (!emailRegexp.test(value)) {
      setMessage('is not a valid email address');
      return false;
    } else {
      setMessage('');
      return true;
    }
  };

const Email: React.FC<IEmail> = (props: IEmail) => {
  const valueHandler = (value: string) => {
    props.email(value);
  };
  return (
    <div>
      <ValidatedTextInput
        name='Email'
        isValid={validate}
        value={valueHandler}
        others={{
          autoComplete: 'off',
          type: 'Email'
        }}
      />
    </div>
  );
};

export interface IEmail {
  email: (email: string) => void;
}

export default Email;
