import React from 'react';
import './Home.scss';
import Menu from './menu/Menu';
import FeatureSection from './feature-section/FeatureSection';
import {Switch, Route} from 'react-router-dom';

const Home: React.FC = (): JSX.Element => {
  return (
    <div className={'Home'}>
      <Menu />
      <div className='container'>
        <main className='home-main'>
          <Switch>
            <Route exact path="/">
              <section className='feature-section'>
                <div className='feature-section-inner'>
                  <FeatureSection />
                </div>
              </section>
              <section className='today-todos-section'>
                <div className='today-todos-section-inner'>
                  All todos
                </div>
              </section>
            </Route>
            <Route exact path="/calendar">
              <div className='calendar-container'></div>
            </Route>
            <Route exact path="/account">
              <div className='account-container'></div>
            </Route>
          </Switch>
        </main>
      </div>
    </div>
  );
}

export default Home;
