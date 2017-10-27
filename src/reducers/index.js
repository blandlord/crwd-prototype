import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import web3Reducer from './web3Reducer';

const rootReducer = combineReducers({
  routing: routerReducer,
  web3Store: web3Reducer
});

export default rootReducer;