import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import {reducer as notifications} from 'react-notification-system-redux';

import web3Reducer from './web3Reducer';
import registryReducer from './registryReducer';
import crowdOwnedReducer from './crowdOwnedReducer';
import crowdOwnedExchangeReducer from './crowdOwnedExchangeReducer';
import votingManagerReducer from './votingManagerReducer';

const rootReducer = combineReducers({
  routing: routerReducer,
  notifications,
  web3Store: web3Reducer,
  registryStore: registryReducer,
  crowdOwnedStore: crowdOwnedReducer,
  crowdOwnedExchangeStore: crowdOwnedExchangeReducer,
  votingManagerStore: votingManagerReducer,
});

export default rootReducer;