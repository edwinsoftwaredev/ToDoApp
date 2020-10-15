import React, {useState, useEffect, useRef} from 'react';
import './FeatureSection.scss';
import WeatherWidget from '../weather-widget/WeatherWidget';
import TodoCard, {ITodo} from '../../shared/todo-card/TodoCard';
import TodoCardService from '../../shared/todo-card/TodoCardService';
import {AxiosResponse, AxiosError} from 'axios';

const FeatureSection: React.FC<any> = () => {
  const mountedRef = useRef<boolean>(false);
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const [todoList, setTodoList] = useState<any[]>([]);

  TodoCardService.getFeturedTodos().then((response: AxiosResponse<ITodo[]>) => {
    if (mountedRef.current) {
      if (response.data.length) {
        setTodoList(response.data);
      }
    }
  }).catch((error: AxiosError) => {
    console.log(error.message);
  });

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
    <div className='FeaturedSection'>
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

export default FeatureSection;
