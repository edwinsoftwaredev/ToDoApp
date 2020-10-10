import React from 'react';
import './TodosList.scss';
import TodoCard, {ITodoCard} from '../../shared/todo-card/TodoCard';

const TodoList: React.FC<any> = () => {
  const deleteHandler = (): void => {
  };
  const todoCard: ITodoCard = {
    todo: {
      title: 'Buying Bread',
      description:
        'Seeing “wheat” on the packaging might suggest your loaf is packed with fiber ' +
        'and nutrients, but you’ll want to check the ingredient list to be sure. The ' +
        'only flour you should see listed is “whole wheat flour” or “100% whole wheat ' +
        'flour”—other flours are often stripped of nutrition.',
      isFeatured: true,
      endDate: '2020-10-09',
      checked: true,
      deleteHandler: deleteHandler
    }
  };

  const emptyTodoCard: ITodoCard = {
    todo: {
      title: '',
      description: '',
      isFeatured: false,
      endDate: '',
      checked: false,
      deleteHandler: deleteHandler
    }
  };

  return (
    <div className='TodoList'>
      <h1 className='heading'>Todos</h1>
      <div className='todos'>
        <TodoCard todo={emptyTodoCard.todo} />
        <TodoCard todo={todoCard.todo} />
      </div>
    </div>
  );
}

export default TodoList;
