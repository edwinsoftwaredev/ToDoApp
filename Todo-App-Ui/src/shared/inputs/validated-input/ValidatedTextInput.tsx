import React, {useState} from 'react';
import './ValidatedTextInput.scss';

const ValidatedTextInput: React.FC<IValidatedTextInput> = (props: any) => {

  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [message, setMessage] = useState('');

  const textHandler = (value: string) => {
    setIsTouched(true);

    const validState = props.isValid(value, (message: string) => {
      setMessage(message);
    });

    setIsValid(validState);
    validState ? props.value(value) : props.value('');
  };

  return (
    <div
      className={
        'validated-input-text' +
        (!isTouched ? '' : isValid ? ' valid' : ' not-valid')
      }
    >
      <div
        className='message-bar'>
        <div className='message'>
          <div>
            {props.name + ' ' + (message)}
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
  isValid: (value: string, setMessage: (message: string) => void) => boolean;
  name: string;
  others: object;
}

export default ValidatedTextInput;
