import React from 'react';
import './Home.scss';
import Menu from './menu/Menu';
import FeatureSection from './feature-section/FeatureSection';
import TodosList from './todos-list/TodosList';
import {Switch, Route} from 'react-router-dom';

const Home: React.FC = (): JSX.Element => {
  return (
    <div className={'Home'}>
      <Menu />
      <div className='container'>
        <main className='home-main'>
          <Switch>
            <Route exact path="/">
              <div className='option-container'>
                <FeatureSection />
              </div>
            </Route>
            <Route exact path="/todos">
              <div className='option-container'>
                <TodosList />
              </div>
            </Route>
            <Route exact path="/calendar">
              <div className='option-container'></div>
            </Route>
            <Route exact path="/account">
              <div className='option-container'></div>
            </Route>
          </Switch>
        </main>
      </div>
    </div>
  );
}

export default Home;
