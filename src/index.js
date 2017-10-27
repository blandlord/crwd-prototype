import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
import {Router, Route} from 'react-router-dom'

import Navbar from './components/Navbar';
import Home from './components/Home';
import Notary from './components/Notary';
import history from './history'

const store = configureStore();


ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <div>
        <Navbar/>
        <Route exact path="/" component={Home}/>
        <Route exact path="/notary" component={Notary}/>
      </div>
    </Router>
  </Provider>
  ,
  document.getElementById('root')
);
