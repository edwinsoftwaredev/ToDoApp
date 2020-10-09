import React, {useState} from 'react';
import './TodoCard.scss';

const TodoCard: React.FC<ITodoCard> = (props: ITodoCard) => {
  const [title, setTitle] = useState<string>(props.todo.title);
  const [description, setDescription] = useState<string>(props.todo.description);
  const [isFeatured, setIsFeatured] = useState<boolean>(props.todo.isFeatured);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [endDate, setEndDate] = useState<string>(props.todo.endDate);

  const handleTitle = (value: string) => {
    setTitle(value);
  };
  const handleDescription = (value: string) => {
    setDescription(value);
  };
  const handleFeatured = () => {
    if (isEditing) {
      setIsFeatured(!isFeatured);
    }
  };
  const handleEndDate = (value: string) => {
    if (isEditing) {
      setEndDate(value);
    }
  };
  const handleEditing = () => {
    setIsEditing(!isEditing);
  };


  return (
    <div className='TodoCard'>
      <div className='header'>
        <div className='title'>
          <input
            className='uk-input'
            type='text'
            value={title}
            onChange={event => handleTitle(event.target.value)}
            disabled={isEditing ? false : true} />
        </div>
        <div className={'todo-star' + (!isFeatured ? ' not-featured' : '')}>
          <i className='bx bxs-star' onClick={() => handleFeatured()}></i>
        </div>
      </div>
      <div className='description'>
        <textarea
          className='uk-textarea'
          value={description}
          onChange={event => handleDescription(event.target.value)}
          disabled={isEditing ? false : true}
        >
        </textarea>
      </div>
      <div className='footer'>
        <div className='edit-btn'>
          <i className='bx bx-edit' onClick={() => handleEditing()}></i>
        </div>
        <div className='todo-end-date'>
          <input
            value={endDate}
            type='date'
            onChange={(event) => handleEndDate(event.target.value)}
            disabled={isEditing ? false : true} />
        </div>
      </div>
    </div>
  );
};

export interface ITodoCard {
  todo: {
    title: string;
    description: string;
    isFeatured: boolean;
    endDate: string;
  }
}

export default TodoCard;
