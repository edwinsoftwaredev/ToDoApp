import React, {useEffect, useState, useRef} from 'react'
import './CompletedTodos.scss';
import TodoCardService from '../../shared/todo-card/TodoCardService';
import {AxiosResponse, AxiosError} from 'axios';
import TodoCard, {ITodo} from '../../shared/todo-card/TodoCard';

const CompletedTodos: React.FC<any> = () => {
  const mountedRef = useRef<boolean>(false);
  const [completedTodoList, setCompletedTodoList] = useState<ITodo[]>([]);

  const getCompletedTodos = () => {
    TodoCardService.getCompletedTodos().then((response: AxiosResponse<ITodo[]>) => {
      if (response.data.length && mountedRef.current) {
        const mappedTodos = response.data.map((todo: ITodo) => {
          todo.endDate = new Date(todo.endDate).toISOString().split('T')[0]
          return todo;
        });
        setCompletedTodoList(mappedTodos);
      }
    }).catch((error: AxiosError) => {
      if (mountedRef.current) {
        console.log(error.message);
      }
    });
  };

  useEffect(() => {
    mountedRef.current = true;

    getCompletedTodos();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const deleteHandler = (id?: number) => {
    if (id && typeof (id) === 'number') {
      TodoCardService.removeTodo(id).then(() => {
        const newList = completedTodoList.filter(value => value.id !== id);
        setCompletedTodoList(newList);
      }).catch((error: AxiosError) => {
        console.log(error.message);
      });
    }
  };

  const updateTodoHandler = (todo: ITodo) => {
    TodoCardService.updateTodo(todo)
      .catch((error: AxiosError) => {
        console.log(error.message);
      });
  };

  return (
    <div className='CompletedTodos'>
      <h1 className='heading'>Completed Todos</h1>
      <div className='completed-todos-container'>
        <div className='completed-todos'>
          {
            completedTodoList.map((todo) =>
              (<TodoCard
                todo={todo}
                deleteHandler={deleteHandler}
                updateTodoHandler={updateTodoHandler}
                key={todo.id} />))
          }
        </div>
      </div>
    </div>
  );
};

export default CompletedTodos;
