import React from 'react';
import {render} from "@testing-library/react";
import {Provider} from "react-redux";
import Store from "../../store/Store";
import WeatherWidget from "./WeatherWidget";
import * as WeatherWidgetImp from './WeatherWidget';

describe('WeatherWidget test cases', () => {
  const store = Store.getInstance();
  let spyWeatherWidgetSelector: jest.SpyInstance;
  
  beforeEach(() => {
    spyWeatherWidgetSelector = jest.spyOn(WeatherWidgetImp, 'weatherSelector');
  });
  
  afterEach(() => {
    spyWeatherWidgetSelector.mockRestore();
  });
  
  test('should render', () => {
    render(
      <Provider store={store}>
        <WeatherWidget />
      </Provider>
    )
  })
});