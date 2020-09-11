import React, {useState} from 'react';
import ValidatedTextInput from '../../validated-input/ValidatedTextInput';
import './Name.scss';

const validate = (
  value: string,
  setMessage: (value: string) => void
): boolean => {
  const nameRexExp = new RegExp('^[a-zA-Z]+$');

  if (!value) {
    setMessage('is required');
    return false;
  } if (!nameRexExp.test(value)) {
    setMessage('must contains only letter.');
    return false;
  } else {
    return true;
  }
}

const Name: React.FC<IName> = (props: any) => {
  const nameHandler = (value: string) => {
    props.name(value);
  }

  return (
    <div>
      <ValidatedTextInput
        isValid={validate}
        name='Name'
        value={(value: string) => nameHandler(value)}
        others={{maxLength: 200, autoComplete: 'off'}} />
    </div>
  );
}

export interface IName {
  name: (name: string) => void;
}

export default Name;
