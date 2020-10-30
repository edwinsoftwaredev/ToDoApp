import React from 'react';
import {render} from '@testing-library/react';
import App from './App';
import Store from './store/Store';
import {Provider} from 'react-redux';
import {MemoryRouter} from 'react-router-dom';
import * as Auth from "./auth/Auth";

const store = Store.getInstance();
describe('App Component', () => {
  beforeEach(() => {
  });

  afterEach(() => {
  });

  test('should render', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </Provider>
    );
  });
  
  test('should call Auth component', () => {
    const spyAuthComponent = jest.spyOn(Auth, 'default');
    
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    
    expect(spyAuthComponent).toHaveBeenCalledTimes(1);
  });
});
