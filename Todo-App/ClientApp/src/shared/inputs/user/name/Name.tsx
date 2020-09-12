import React from 'react';
import ValidatedTextInput from '../../validated-input/ValidatedTextInput';
import './Name.scss';

const validate = (
  value: string,
  setMessage: (value: string) => void
): boolean => {
  const nameRexExp = new RegExp(/^([a-zA-Z]+[ ]{0,1})+$/);
  if (!value) {
    setMessage('is required');
    return false;
  } else if (!nameRexExp.test(value)) {
    setMessage('must contains only letter and one space between two words.');
    return false;
  } else {
    setMessage('');
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
        value={(value: string) => nameHandler(value.trim())}
        others={{maxLength: 200, autoComplete: 'off'}} />
    </div>
  );
}

export interface IName {
  name: (name: string) => void;
}

export default Name;
