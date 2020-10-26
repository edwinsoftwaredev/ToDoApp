import React, {useEffect} from 'react';
import './App.scss';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import Auth from './auth/Auth';

function AppContainer(): JSX.Element {
  useEffect(() => {
    // AccountService.getAntiForgeryToken();
  }, []);

  return (
    <div className="App">
      <Auth />
    </div>
  );
}

function App(): JSX.Element {
  return (
    <Router>
      <AppContainer />
    </Router>
  );
}

export default App;
