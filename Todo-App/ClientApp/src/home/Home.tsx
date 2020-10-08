import React, {useState} from 'react';
import './Home.scss';
import Menu from './menu/Menu';

const Home: React.FC = (): JSX.Element => {
  return (
    <div className={'Home'}>
      <Menu />
      <div className='container'>
        <main className='home-main'>
          <section className='feature-section'>
            <div className='feature-section-inner'>
              feature todos - weather widget mobile
            </div>
          </section>
          <section className='today-todos-section'>
            <div className='today-todos-section-inner'>
              All todos
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Home;
