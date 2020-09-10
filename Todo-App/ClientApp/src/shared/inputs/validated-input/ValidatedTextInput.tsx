import React, {useState} from 'react';
import './ValidatedTextInput.scss';

const ValidatedTextInput: React.FC<IValidatedTextInput> = (props: any) => {

  const [isTouched, setIsTouched] = useState(false);

  const textHandler = (value: string) => {
    setIsTouched(true);
    props.value(value);
  };

  return (
    <div
      className={
        'validated-input-text' +
        (!isTouched && !props.submitted ? '' : props.isValid ? ' valid' : ' not-valid')
      }
    >
      <div
        className='message-bar'>
        <div className='message'>
          <div>
            {props.name + ' ' + (props.message)}
          </div>
        </div>
      </div>
      <input
        className='uk-input'
        type='text'
        name={props.name}
        onChange={
          event => textHandler(event.target.value)
        }
        {...props.others}
      />
    </div>
  );
}

export interface IValidatedTextInput {
  value: (value: string) => void;
  isValid: boolean;
  message: string;
  name: string;
  others: object;
}

export default ValidatedTextInput;
