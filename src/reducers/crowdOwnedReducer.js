import {Map as ImmutableMap} from 'immutable';


let initialData = {
  newCrowdOwnedContract: {
    name: '',
    symbol: '',
    imageUrl: '',
  },
  crowdOwnedContracts: [],
  crowdOwnedContract: null,
  newTokensTransfer: {
    to: '',
    amount: 0
  },
  newValuation: {
    blockheight: 0,
    currency: 'EUR',
    value: 0,
  }
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


  const loadCrowdOwnedContract = (state) => {
    return state
      .set('crowdOwnedContract', null);
  };

  const fetchLoadCrowdOwnedContractRequest = (state) => {
    return state
      .set('loadingCrowdOwnedContract', true);
  };

  const fetchLoadCrowdOwnedContractSuccess = (state) => {
    return state
      .set('loadingCrowdOwnedContract', false)
      .set('crowdOwnedContract', action.crowdOwnedContract);
  };

  const fetchLoadCrowdOwnedContractFailure = (state) => {
    return state
      .set('loadingCrowdOwnedContract', false);
  };


  const setNewTokensTransfer = (state) => {
    return state
      .set('newTokensTransfer', action.newTokensTransfer);
  };

  const postSaveNewTokensTransferRequest = (state) => {
    return state
      .set('savingNewTokensTransfer', true);
  };

  const postSaveNewTokensTransferSuccess = (state) => {
    return state
      .set('savingNewTokensTransfer', false)
      .set('newTokensTransfer', initialData.newTokensTransfer);
  };

  const postSaveNewTokensTransferFailure = (state) => {
    return state
      .set('savingNewTokensTransfer', false);
  };
  

  const postKillCrowdOwnedContractRequest = (state) => {
    return state
      .set('killingCrowdOwnedContract', true);
  };

  const postKillCrowdOwnedContractSuccess = (state) => {
    return state
      .set('killingCrowdOwnedContract', false)
      .set('crowdOwnedContract', null);
  };

  const postKillCrowdOwnedContractFailure = (state) => {
    return state
      .set('killingCrowdOwnedContract', false);
  };


  const setNewValuation = (state) => {
    return state
      .set('newValuation', action.newValuation);
  };

  const postSaveNewValuationRequest = (state) => {
    return state
      .set('savingNewValuation', true);
  };

  const postSaveNewValuationSuccess = (state) => {
    return state
      .set('savingNewValuation', false)
      .set('newValuation', initialData.newValuation);
  };

  const postSaveNewValuationFailure = (state) => {
    return state
      .set('savingNewValuation', false);
  };
  

  const actions = {
    'SET_NEW_CROWD_OWNED_CONTRACT': () => setNewCrowdOwnedContract(state),
    'POST_SAVE_NEW_CROWD_OWNED_CONTRACT_REQUEST': () => postSaveNewCrowdOwnedContractRequest(state),
    'POST_SAVE_NEW_CROWD_OWNED_CONTRACT_SUCCESS': () => postSaveNewCrowdOwnedContractSuccess(state),
    'POST_SAVE_NEW_CROWD_OWNED_CONTRACT_FAILURE': () => postSaveNewCrowdOwnedContractFailure(state),
    'FETCH_LOAD_CROWD_OWNED_CONTRACTS_REQUEST': () => fetchLoadCrowdOwnedContractsRequest(state),
    'FETCH_LOAD_CROWD_OWNED_CONTRACTS_SUCCESS': () => fetchLoadCrowdOwnedContractsSuccess(state),
    'FETCH_LOAD_CROWD_OWNED_CONTRACTS_FAILURE': () => fetchLoadCrowdOwnedContractsFailure(state),
    'LOAD_CROWD_OWNED_CONTRACT': () => loadCrowdOwnedContract(state),
    'FETCH_LOAD_CROWD_OWNED_CONTRACT_REQUEST': () => fetchLoadCrowdOwnedContractRequest(state),
    'FETCH_LOAD_CROWD_OWNED_CONTRACT_SUCCESS': () => fetchLoadCrowdOwnedContractSuccess(state),
    'FETCH_LOAD_CROWD_OWNED_CONTRACT_FAILURE': () => fetchLoadCrowdOwnedContractFailure(state),
    'SET_NEW_TOKENS_TRANSFER': () => setNewTokensTransfer(state),
    'POST_SAVE_NEW_TOKENS_TRANSFER_REQUEST': () => postSaveNewTokensTransferRequest(state),
    'POST_SAVE_NEW_TOKENS_TRANSFER_SUCCESS': () => postSaveNewTokensTransferSuccess(state),
    'POST_SAVE_NEW_TOKENS_TRANSFER_FAILURE': () => postSaveNewTokensTransferFailure(state),  
    'POST_KILL_CROWD_OWNED_CONTRACT_REQUEST': () => postKillCrowdOwnedContractRequest(state),
    'POST_KILL_CROWD_OWNED_CONTRACT_SUCCESS': () => postKillCrowdOwnedContractSuccess(state),
    'POST_KILL_CROWD_OWNED_CONTRACT_FAILURE': () => postKillCrowdOwnedContractFailure(state),
    'SET_NEW_VALUATION': () => setNewValuation(state),
    'POST_SAVE_NEW_VALUATION_REQUEST': () => postSaveNewValuationRequest(state),
    'POST_SAVE_NEW_VALUATION_SUCCESS': () => postSaveNewValuationSuccess(state),
    'POST_SAVE_NEW_VALUATION_FAILURE': () => postSaveNewValuationFailure(state),
    'DEFAULT': () => state
  };

  return ((action && actions[action.type]) ? actions[action.type] : actions['DEFAULT'])()
}