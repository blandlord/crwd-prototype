import {Map as ImmutableMap} from 'immutable';


let initialData = {
  newCrowdOwnedContract: {
    name: '',
    symbol: '',
  },
  crowdOwnedContracts: [],
};

export default function crowdOwnedReducer(state = new ImmutableMap(initialData), action) {

  const setNewCrowdOwnedContract = (state) => {
    return state
      .set('newCrowdOwnedContract', action.newCrowdOwnedContract);
  };

  const postSaveNewCrowdOwnedContractRequest = (state) => {
    return state
      .set('savingNewCrowdOwnedContract', true);
  };

  const postSaveNewCrowdOwnedContractSuccess = (state) => {
    return state
      .set('savingNewCrowdOwnedContract', false)
      .set('newCrowdOwnedContract', initialData.newCrowdOwnedContract);
  };

  const postSaveNewCrowdOwnedContractFailure = (state) => {
    return state
      .set('savingNewCrowdOwnedContract', false);
  };

  
  const fetchLoadCrowdOwnedContractsRequest = (state) => {
    return state
      .set('loadingCrowdOwnedContracts', true);
  };

  const fetchLoadCrowdOwnedContractsSuccess = (state) => {
    return state
      .set('loadingCrowdOwnedContracts', false)
      .set('crowdOwnedContracts', action.crowdOwnedContracts);
  };

  const fetchLoadCrowdOwnedContractsFailure = (state) => {
    return state
      .set('loadingCrowdOwnedContracts', false);
  };
  
  
  const actions = {
    'SET_NEW_CROWD_OWNED_CONTRACT': () => setNewCrowdOwnedContract(state),
    'POST_SAVE_NEW_CROWD_OWNED_CONTRACT_REQUEST': () => postSaveNewCrowdOwnedContractRequest(state),
    'POST_SAVE_NEW_CROWD_OWNED_CONTRACT_SUCCESS': () => postSaveNewCrowdOwnedContractSuccess(state),
    'POST_SAVE_NEW_CROWD_OWNED_CONTRACT_FAILURE': () => postSaveNewCrowdOwnedContractFailure(state),
    'FETCH_LOAD_CROWD_OWNED_CONTRACTS_REQUEST': () => fetchLoadCrowdOwnedContractsRequest(state),
    'FETCH_LOAD_CROWD_OWNED_CONTRACTS_SUCCESS': () => fetchLoadCrowdOwnedContractsSuccess(state),
    'FETCH_LOAD_CROWD_OWNED_CONTRACTS_FAILURE': () => fetchLoadCrowdOwnedContractsFailure(state),
    'DEFAULT': () => state
  };

  return ((action && actions[action.type]) ? actions[action.type] : actions['DEFAULT'])()
}