import React from 'react';
import './FeatureSection.scss';
import WeatherWidget from '../weather-widget/WeatherWidget';
import TodoCard, {ITodoCard} from '../../shared/todo-card/TodoCard';

const FeatureSection: React.FC<any> = () => {
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

  return (
    <div className='FeaturedSection'>
      <h1 className='heading'>Featured Todos</h1>
      <div className='featured-todos-container'>
        <div className='featured-todos'>
          <div className='not-smart'>
            <WeatherWidget />
          </div>
          <TodoCard todo={todoCard.todo} />
          <TodoCard todo={todoCard.todo} />
          <TodoCard todo={todoCard.todo} />
          <TodoCard todo={todoCard.todo} />
          <TodoCard todo={todoCard.todo} />
          <TodoCard todo={todoCard.todo} />
          <TodoCard todo={todoCard.todo} />
          <TodoCard todo={todoCard.todo} />
          <TodoCard todo={todoCard.todo} />
          <TodoCard todo={todoCard.todo} />
          <TodoCard todo={todoCard.todo} />
          <TodoCard todo={todoCard.todo} />
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
