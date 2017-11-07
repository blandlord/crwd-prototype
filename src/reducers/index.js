import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import {reducer as notifications} from 'react-notification-system-redux';

import web3Reducer from './web3Reducer';
import registryReducer from './registryReducer';
import crowdOwnedReducer from './crowdOwnedReducer';

const rootReducer = combineReducers({
  routing: routerReducer,
  notifications,
  web3Store: web3Reducer,
  registryStore: registryReducer,
  crowdOwnedStore: crowdOwnedReducer,
});

export default rootReducer;