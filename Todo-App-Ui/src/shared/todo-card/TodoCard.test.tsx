import React from 'react';
import {render} from "@testing-library/react";
import TodoCard, {ITodo} from "./TodoCard";

describe('TodoCard tests', () => {
  const emptyTodo: ITodo = {
    createdBy: {},
    id: 1,
    createdById: '',
    endDate: '01-01-2020',
    description: '',
    isCompleted: true,
    isFeatured: true,
    title: ''
  };
  
  const deleteHandler = () => {
  };
  
  const updateHandler = () => {
    
  };
  
  beforeEach(() => {
    
  });
  
  afterEach(() => {
    
  });
  
  test('should render', () => {
    render(
      <TodoCard
        todo={emptyTodo}
        deleteHandler={deleteHandler}
        updateTodoHandler={updateHandler} />
    );
  });
});