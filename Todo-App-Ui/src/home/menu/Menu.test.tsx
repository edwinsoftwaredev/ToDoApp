import React from 'react';
import {render} from "@testing-library/react";
import {Provider} from "react-redux";
import Store from "../../store/Store";
import Menu from "./Menu";
import * as WeatherWidget from '../weather-widget/WeatherWidget';
import {IWeather} from "../weather-widget/WeatherWidget";
import {waitFor} from '@testing-library/react';
import {AuthService} from "../../auth/AuthService";

jest.mock('react-router-dom', () => ({
  ...jest.requireActual<any>('react-router-dom'),
  useLocation: () => ({pathname: ''})
}));

describe('Menu tests', () => {
  const store = Store.getInstance();
  let spyWeatherWidgetSelector: jest.SpyInstance;
  let spyAuthServiceSignOut: jest.SpyInstance;
  
  beforeEach(() => {
    const authService = AuthService.getInstance();
    spyWeatherWidgetSelector = jest.spyOn(WeatherWidget, 'weatherSelector');
    spyAuthServiceSignOut = jest.spyOn(authService, 'startSignOut');
    
    const mockWeather: IWeather = {
      weatherDescription: '',
      weatherIcon: '',
      weatherTemperature: ''
    }
    spyWeatherWidgetSelector.mockImplementation(() => mockWeather);
  });
  
  afterEach(() => {
    spyWeatherWidgetSelector.mockRestore();
    spyAuthServiceSignOut.mockRestore();
  })
  
  test('should render', async () => {
    render(
      <Provider store={store}>
        <Menu/>
      </Provider>
    );
  });
  
  test('should handle signout', async () => {
    const {container} = render(
      <Provider store={store}>
        <Menu />
      </Provider>
    );
    
    const btnSignOut = container.getElementsByClassName('bx bx-log-out bx-md')[0].parentElement as HTMLLIElement;
    btnSignOut.click();
    
    await waitFor(() => {
      expect(spyAuthServiceSignOut).toHaveBeenCalledTimes(1);
    })
  });
});