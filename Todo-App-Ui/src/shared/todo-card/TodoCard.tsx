import React, {useState, useEffect} from 'react';
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
  const [isDeletable, setIsDeletable] = useState<boolean>(true);
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

  useEffect(() => {
    setIsDeletable(!id && !title);
  }, [id, title]);

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
          if (title && endDate) {
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
            placeholder="todo title..."
            onChange={event => handleTitle(event.target.value)}
            disabled={!isEditing} />
        </div>
        <div className={'checkmark' + (isCompleted ? ' checked' : '') + (isEditing ? ' editing' : '')}>
          <i className='bx bx-check' onClick={() => handleCheckMark()} />
        </div>
        <div className={'todo-star' + (!isFeatured ? ' not-featured' : '') + (isEditing ? ' editing' : '')}>
          <i className='bx bxs-star' onClick={() => handleFeatured()} />
        </div>
      </div>
      <div className='description'>
        <textarea
          className={'uk-textarea' + (isEditing ? ' editing' : '')}
          value={description}
          placeholder="todo description..."
          onChange={event => handleDescription(event.target.value)}
          disabled={!isEditing}
        >
        </textarea>
      </div>
      <div className='footer'>
        <div className='edit-btn-container'>
          <i
            className={'bx bx-edit' + (isEditing ? ' editing' : '')}
            onClick={() => handleEditing()} />
        </div>
        <div className='delete-btn'>
          {!isDeletable ? <i
            className={'bx bx-trash' + (isEditing ? ' editing' : '')}
            onClick={() => isEditing ? props.deleteHandler(props.todo.id) : {}} /> : null}
        </div>
        <div className='footer-items-space' />
        <div className='todo-end-date'>
          <input
            className={(isEditing ? ' editing' : '')}
            value={endDate}
            type='date'
            onChange={(event) => handleEndDate(event.target.value)}
            disabled={!isEditing} />
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
