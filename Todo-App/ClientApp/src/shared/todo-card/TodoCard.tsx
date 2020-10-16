import React, {useState} from 'react';
import './TodoCard.scss';

const TodoCard: React.FC<ITodoCard> = (props: ITodoCard) => {
  const [id, setId] = useState<number>(props.todo.id as number);
  const [title, setTitle] = useState<string>(props.todo.title);
  const [description, setDescription] = useState<string>(props.todo.description);
  const [isFeatured, setIsFeatured] = useState<boolean>(props.todo.isFeatured);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [endDate, setEndDate] = useState<string>(props.todo.endDate);
  const [isCompleted, setIsCompleted] = useState<boolean>(props.todo.isCompleted);
  const [createdById, setCreatedById] = useState<string | undefined>(props.todo.createdById);
  // const [createdBy, setCreatedBy] = useState<any>(props.todo.createdBy);

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
      setIsCompleted(!isCompleted);
    }
  };
  const handleEndDate = (value: string) => {
    if (isEditing) {
      setEndDate(value);
    }
  };
  const handleEditing = () => {

    if (!isEditing && typeof (id) === 'undefined') {
      setEndDate(new Date().toISOString().split('T')[0]);
    }

    if (isEditing) {
      if (id) {
        props.updateTodoHandler({
          id: id,
          createdById: createdById,
          title: title,
          description: description,
          isFeatured: isFeatured,
          endDate: endDate,
          isCompleted: isCompleted
        });
      } else {
        if (props.saveTodoHandler) {
          if (title) {
            props.saveTodoHandler({
              title: title,
              description: description,
              isFeatured: isFeatured,
              endDate: endDate,
              isCompleted: isCompleted
            }).then(() => {
              setTitle('');
              setCreatedById('');
              setDescription('');
              setIsFeatured(false);
              setEndDate('');
              setIsCompleted(false);
            });
          }
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
            placeholder="new todo's title..."
            onChange={event => handleTitle(event.target.value)}
            disabled={isEditing ? false : true} />
        </div>
        <div className={'checkmark' + (isCompleted ? ' checked' : '') + (isEditing ? ' editing' : '')}>
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
        <div className='footer-items-space'></div>
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
  createdById?: string;
  createdBy?: any;
  title: string;
  description: string;
  isFeatured: boolean;
  endDate: string;
  isCompleted: boolean;
}

export default TodoCard;
