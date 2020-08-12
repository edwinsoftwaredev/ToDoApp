import React from 'react';
import Home, * as HomeUtils from './Home';
import {render} from '@testing-library/react';
import Store from '../store/Store';
import {Provider} from 'react-redux';

describe('Home Component', () => {
  const store = Store.getInstance();
  beforeEach(() => {
  });

  afterEach(() => {
  });

  test('should render', () => {
    // this could have a mocked implemenation
    const homeSpy = jest.spyOn(HomeUtils, 'default');
    render(<Provider store={store}><Home /></Provider>);
    expect(homeSpy).toHaveBeenCalledTimes(1);
  });
});
