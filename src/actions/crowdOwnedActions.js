import {action, createRequestTypes} from '../utils/actionUtils';

export const SET_NEW_CROWD_OWNED_CONTRACT = 'SET_NEW_CROWD_OWNED_CONTRACT';
export const setNewCrowdOwnedContract = data => action(SET_NEW_CROWD_OWNED_CONTRACT, data);


export const SAVE_NEW_CROWD_OWNED_CONTRACT = 'SAVE_NEW_CROWD_OWNED_CONTRACT';
export const saveNewCrowdOwnedContract = data => action(SAVE_NEW_CROWD_OWNED_CONTRACT, data);

export const POST_SAVE_NEW_CROWD_OWNED_CONTRACT = createRequestTypes('POST_SAVE_NEW_CROWD_OWNED_CONTRACT');
export const postSaveNewCrowdOwnedContract = {
  request: () => action(POST_SAVE_NEW_CROWD_OWNED_CONTRACT.REQUEST),
  success: (data) => action(POST_SAVE_NEW_CROWD_OWNED_CONTRACT.SUCCESS, data),
  failure: (error) => action(POST_SAVE_NEW_CROWD_OWNED_CONTRACT.FAILURE, error),
};


export const LOAD_CROWD_OWNED_CONTRACTS = 'LOAD_CROWD_OWNED_CONTRACTS';
export const loadCrowdOwnedContracts = data => action(LOAD_CROWD_OWNED_CONTRACTS, data);

export const FETCH_LOAD_CROWD_OWNED_CONTRACTS = createRequestTypes('FETCH_LOAD_CROWD_OWNED_CONTRACTS');
export const fetchLoadCrowdOwnedContracts = {
  request: () => action(FETCH_LOAD_CROWD_OWNED_CONTRACTS.REQUEST),
  success: (data) => action(FETCH_LOAD_CROWD_OWNED_CONTRACTS.SUCCESS, data),
  failure: (error) => action(FETCH_LOAD_CROWD_OWNED_CONTRACTS.FAILURE, error),
};


export const LOAD_CROWD_OWNED_CONTRACT = 'LOAD_CROWD_OWNED_CONTRACT';
export const loadCrowdOwnedContract = data => action(LOAD_CROWD_OWNED_CONTRACT, data);

export const FETCH_LOAD_CROWD_OWNED_CONTRACT = createRequestTypes('FETCH_LOAD_CROWD_OWNED_CONTRACT');
export const fetchLoadCrowdOwnedContract = {
  request: () => action(FETCH_LOAD_CROWD_OWNED_CONTRACT.REQUEST),
  success: (data) => action(FETCH_LOAD_CROWD_OWNED_CONTRACT.SUCCESS, data),
  failure: (error) => action(FETCH_LOAD_CROWD_OWNED_CONTRACT.FAILURE, error),
};

