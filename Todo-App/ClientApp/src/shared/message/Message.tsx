import React from 'react';

// when using typescript is need to implement an interface in the React.FC
// this lets typescript to validate all the props when the component is used:
// <Message /> -> error. <Message  text={state}/> -> no error
//
// This component could to be more customizable, like:
// close button
// ...
const Message: React.FC<IMessage> = (props: any) => {
  if (!props.text) {
    return null;
  }

  return (
    <div>
      <h3>{props.text}</h3>
    </div>
  );
}

export interface IMessage {
  text: string;
}

export default Message;
