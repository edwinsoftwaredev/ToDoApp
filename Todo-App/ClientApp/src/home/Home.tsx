import React, {useState} from 'react';
import './Home.scss';
import Menu from './menu/Menu';

const Home: React.FC = (): JSX.Element => {
  return (
    <div className={'Home'}>
      <Menu />
      <div className='container'>
        <main className='home-main'>
        </main>
      </div>
    </div>
  );
}

export default Home;
