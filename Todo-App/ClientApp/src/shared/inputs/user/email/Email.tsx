import React from 'react';
import ValidatedTextInput from '../../validated-input/ValidatedTextInput';
import './Email.scss';

const validate =
  (value: string, setMessage: (message: string) => void): boolean => {
    return true;
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
          autoComplete: 'off'
        }}
      />
    </div>
  );
};

export interface IEmail {
  email: (email: string) => void;
}

export default Email;
