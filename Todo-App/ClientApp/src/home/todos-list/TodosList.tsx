import React, {useState} from 'react';
import './TodosList.scss';
import TodoCard, {ITodo} from '../../shared/todo-card/TodoCard';
import TodoCardService from '../../shared/todo-card/TodoCardService';
import {AxiosResponse, AxiosError} from 'axios';

const TodoList: React.FC<any> = () => {
  const emptyTodo: ITodo = {
    title: '',
    description: '',
    isFeatured: false,
    endDate: '',
    checked: false
  };
  const [todoList, setTodoList] = useState<ITodo[]>([emptyTodo]);

  TodoCardService.getTodos().then((response: AxiosResponse<ITodo[]>) => {
    setTodoList(response.data);
  }).catch((error: AxiosError) => {
    console.log(error.message);
  });

  const deleteHandler = (id?: number): void => {
    if (id && typeof (id) === 'number') {
      TodoCardService.removeTodo(id).then(() => {
        const newTodoList = todoList.filter((todo: ITodo) => todo.id !== id);
        setTodoList(newTodoList);
      }).catch((error: AxiosError) => {
        console.log(error);
      });
    }
  };

  const saveTodoHandler = async (todo: ITodo): Promise<void> => {
    return TodoCardService.saveTodo(todo).then((response: AxiosResponse<ITodo>) => {
      // to keep inmutability another array is instanciated
      // React DOM will only update what is updated!
      const newTodoList = Array.from(todoList);
      newTodoList.push(response.data);
      setTodoList(newTodoList);
      return Promise.resolve();
    }).catch((error: AxiosError) => {
      console.log(error.message);
      return Promise.reject();
    });
  };

  const updateTodoHandler = (todo: ITodo): void => {
    TodoCardService.updateTodo(todo)
      .catch((error: AxiosError) => {
        console.log(error.message);
      });
  }

  return (
    <div className='TodoList'>
      <h1 className='heading'>Todos</h1>
      <div className='todos-container'>
        <div className='todos'>
          {
            todoList
              .map(todo => (
                <TodoCard
                  todo={todo}
                  saveTodoHandler={saveTodoHandler}
                  updateTodoHandler={updateTodoHandler}
                  deleteHandler={deleteHandler}
                  key={todo.id ? todo.id : 'none'} />)
              )
          }
        </div>
      </div>
    </div>
  );
}

export default TodoList;
