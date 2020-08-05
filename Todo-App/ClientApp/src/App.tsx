import React from 'react';
import './App.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Home from './home/Home';
import Auth from './auth/Auth';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
          </Switch>
          <Auth />
        </header>
      </div>
    </Router>
  );
}

export default App;
