import React, {useState} from 'react';
import './TodoCard.scss';

const TodoCard: React.FC<ITodoCard> = (props: ITodoCard) => {
  const [id, setId] = useState<number>(props.todo.id as number);
  const [title, setTitle] = useState<string>(props.todo.title);
  const [description, setDescription] = useState<string>(props.todo.description);
  const [isFeatured, setIsFeatured] = useState<boolean>(props.todo.isFeatured);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [endDate, setEndDate] = useState<string>(props.todo.endDate);
  const [checked, setChecked] = useState<boolean>(props.todo.checked);

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
  const handleCheckMark = () => {
    if (isEditing) {
      setChecked(!checked);
    }
  };
  const handleEndDate = (value: string) => {
    if (isEditing) {
      setEndDate(value);
    }
  };
  const handleEditing = () => {
    if (isEditing) {
      if (id) {
        props.updateTodoHandler({
          id: id,
          title: title,
          description: description,
          isFeatured: isFeatured,
          endDate: endDate,
          checked: checked
        });
      } else {
        if (props.saveTodoHandler) {
          props.saveTodoHandler({
            title: title,
            description: description,
            isFeatured: isFeatured,
            endDate: endDate,
            checked: checked
          }).then(() => {
            setTitle('');
            setDescription('');
            setIsFeatured(false);
            setEndDate('');
            setChecked(false);
          });
        }
      }
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className='TodoCard'>
      <div className='header'>
        <div className='title'>
          <input
            className={'uk-input' + (isEditing ? ' editing' : '')}
            type='text'
            value={title}
            placeholder="todo's title..."
            onChange={event => handleTitle(event.target.value)}
            disabled={isEditing ? false : true} />
        </div>
        <div className={'checkmark' + (checked ? ' checked' : '') + (isEditing ? ' editing' : '')}>
          <i className='bx bx-check' onClick={() => handleCheckMark()}></i>
        </div>
        <div className={'todo-star' + (!isFeatured ? ' not-featured' : '') + (isEditing ? ' editing' : '')}>
          <i className='bx bxs-star' onClick={() => handleFeatured()}></i>
        </div>
      </div>
      <div className='description'>
        <textarea
          className={'uk-textarea' + (isEditing ? ' editing' : '')}
          value={description}
          placeholder="todo's description..."
          onChange={event => handleDescription(event.target.value)}
          disabled={isEditing ? false : true}
        >
        </textarea>
      </div>
      <div className='footer'>
        <div className='edit-btn-container'>
          <i
            className={'bx bx-edit' + (isEditing ? ' editing' : '')}
            onClick={() => handleEditing()}></i>
        </div>
        <div className='delete-btn'>
          <i
            className={'bx bx-trash' + (isEditing ? ' editing' : '')}
            onClick={() => isEditing ? props.deleteHandler(props.todo.id) : {}}></i>
        </div>
        <div className='todo-end-date'>
          <input
            className={(isEditing ? ' editing' : '')}
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
  todo: ITodo,
  deleteHandler: (id?: number) => void,
  updateTodoHandler: (todo: ITodo) => void,
  saveTodoHandler?: (todo: ITodo) => Promise<void>
}

export interface ITodo {
  id?: number;
  title: string;
  description: string;
  isFeatured: boolean;
  endDate: string;
  checked: boolean;
}

export default TodoCard;
