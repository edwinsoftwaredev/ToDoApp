import React, {useState} from 'react';
import './FeatureSection.scss';
import WeatherWidget from '../weather-widget/WeatherWidget';
import TodoCard from '../../shared/todo-card/TodoCard';

const initialList = (() => {
  let todoList: any[] = [];

  for (let i = 0; i < 10; i++) {
    const todo =
    {
      id: i,
      title: 'Buying Bread',
      description:
        'Seeing “wheat” on the packaging might suggest your loaf is packed with fiber ' +
        'and nutrients, but you’ll want to check the ingredient list to be sure. The ' +
        'only flour you should see listed is “whole wheat flour” or “100% whole wheat ' +
        'flour”—other flours are often stripped of nutrition.',
      isFeatured: true,
      endDate: '2020-10-09',
      checked: true,
    }
    todoList.push(todo);
  }

  return todoList;
})();

const FeatureSection: React.FC<any> = () => {
  const [todoList, setTodoList] = useState<any[]>(initialList);

  const deleteHandler = (id?: number): void => {
    const newList = todoList.filter(value => value.id !== id);
    setTodoList(newList);
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
              (<TodoCard todo={todo} deleteHandler={deleteHandler} key={todo.id} />))
          }
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
