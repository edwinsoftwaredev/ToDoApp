import React, {useState, useEffect, useRef} from 'react';
import './FeaturedTodos.scss';
import WeatherWidget from '../weather-widget/WeatherWidget';
import TodoCard, {ITodo} from '../../shared/todo-card/TodoCard';
import TodoCardService from '../../shared/todo-card/TodoCardService';
import {AxiosResponse, AxiosError} from 'axios';
import {useSelector} from 'react-redux';
import {todoUserSelector} from '../Home';

const FeaturedTodos: React.FC<any> = () => {
  const mountedRef = useRef<boolean>(false);
  const [todoList, setTodoList] = useState<any[]>([]);
  const todoUser = useSelector(todoUserSelector)

  const getFeturedTodos =
    () => TodoCardService.getFeturedTodos().then((response: AxiosResponse<ITodo[]>) => {
      if (mountedRef.current) {
        if (response.data.length) {
          const mappedData = response.data.map((todo: ITodo) => {
            todo.endDate = new Date(todo.endDate).toISOString().split('T')[0]
            return todo;
          });
          setTodoList(mappedData);
        }
      }
    }).catch((error: AxiosError) => {
      console.log(error.message);
    });

  useEffect(() => {
    mountedRef.current = true;

    if (todoUser.userId) {
      getFeturedTodos();
    }

    return () => {
      mountedRef.current = false;
    };
  }, [todoUser])

  const deleteHandler = (id?: number): void => {
    if (id && typeof (id) === 'number') {
      TodoCardService.removeTodo(id).then(() => {
        const newList = todoList.filter(value => value.id !== id);
        setTodoList(newList);
      }).catch((error: AxiosError) => {
        console.log(error.message);
      });
    }
  };

  const updateTodoHandler = (todo: ITodo): void => {
    TodoCardService.updateTodo(todo)
      .catch((error: AxiosError) => {
        console.log(error.message);
      });
  };

  return (
    <div className='FeaturedTodos'>
      <h1 className='heading'>Featured Todos</h1>
      <div className='featured-todos-container'>
        <div className='featured-todos'>
          <div className='not-smart'>
            <WeatherWidget />
          </div>
          {
            todoList.map((todo) =>
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

export default FeaturedTodos;
