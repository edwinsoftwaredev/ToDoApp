import React from 'react';
import Home, * as HomeUtils from './Home';
import {render} from '@testing-library/react';
import Store from '../store/Store';
import {Provider} from 'react-redux';
import {MemoryRouter} from 'react-router-dom';

describe('Home Component', () => {
  const store = Store.getInstance();

  beforeEach(() => {
  });

  afterEach(() => {
  });

  test('should render', () => {
    const mockGeolocation = {
      getCurrentPosition: jest.fn()
    };

    global.navigator.geolocation = mockGeolocation;
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Home />          
        </MemoryRouter>
      </Provider>
    );
  });
});
