import React from 'react';
import './FeatureSection.scss';
import WeatherWidget from '../weather-widget/WeatherWidget';
import TodoCard, {ITodoCard} from '../../shared/todo-card/TodoCard';

const FeatureSection: React.FC<any> = () => {
  const todoCard: ITodoCard = {
    todo: {
      title: 'Buying Bread',
      description:
        'Seeing “wheat” on the packaging might suggest your loaf is packed with fiber ' +
        'and nutrients, but you’ll want to check the ingredient list to be sure. The ' +
        'only flour you should see listed is “whole wheat flour” or “100% whole wheat ' +
        'flour”—other flours are often stripped of nutrition.',
      isFeatured: true,
      endDate: '2020-10-09'
    }
  };

  return (
    <div className='FeatureSection'>
      <h1 className='heading'>Feature Todos</h1>
      <div className='feature-todos'>
        <div className='not-smart'>
          <WeatherWidget />
        </div>
        <TodoCard todo={todoCard.todo} />
      </div>
    </div>
  );
};

export default FeatureSection;
