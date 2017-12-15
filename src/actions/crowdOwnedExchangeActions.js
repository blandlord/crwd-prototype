import {action, createRequestTypes} from '../utils/actionUtils';


export const LOAD_CROWD_OWNED_CONTRACT_SUMMARY = 'LOAD_CROWD_OWNED_CONTRACT_SUMMARY';
export const loadCrowdOwnedContractSummary = data => action(LOAD_CROWD_OWNED_CONTRACT_SUMMARY, data);

export const FETCH_LOAD_CROWD_OWNED_CONTRACT_SUMMARY = createRequestTypes('FETCH_LOAD_CROWD_OWNED_CONTRACT_SUMMARY');
export const fetchLoadCrowdOwnedContractSummary = {
  request: () => action(FETCH_LOAD_CROWD_OWNED_CONTRACT_SUMMARY.REQUEST),
  success: (data) => action(FETCH_LOAD_CROWD_OWNED_CONTRACT_SUMMARY.SUCCESS, data),
  failure: (error) => action(FETCH_LOAD_CROWD_OWNED_CONTRACT_SUMMARY.FAILURE, error),
};


export const LOAD_BALANCES = 'LOAD_BALANCES';
export const loadBalances = data => action(LOAD_BALANCES, data);

export const FETCH_LOAD_BALANCES = createRequestTypes('FETCH_LOAD_BALANCES');
export const fetchLoadBalances = {
  request: () => action(FETCH_LOAD_BALANCES.REQUEST),
  success: (data) => action(FETCH_LOAD_BALANCES.SUCCESS, data),
  failure: (error) => action(FETCH_LOAD_BALANCES.FAILURE, error),
};

export const LOAD_ORDERS = 'LOAD_ORDERS';
export const loadOrders = data => action(LOAD_ORDERS, data);

export const FETCH_LOAD_ORDERS = createRequestTypes('FETCH_LOAD_ORDERS');
export const fetchLoadOrders = {
  request: () => action(FETCH_LOAD_ORDERS.REQUEST),
  success: (data) => action(FETCH_LOAD_ORDERS.SUCCESS, data),
  failure: (error) => action(FETCH_LOAD_ORDERS.FAILURE, error),
};


export const SET_NEW_ORDER = 'SET_NEW_ORDER';
export const setNewOrder = data => action(SET_NEW_ORDER, data);

export const SAVE_NEW_ORDER = 'SAVE_NEW_ORDER';
export const saveNewOrder = data => action(SAVE_NEW_ORDER, data);

export const POST_SAVE_NEW_ORDER = createRequestTypes('POST_SAVE_NEW_ORDER');
export const postSaveNewOrder = {
  request: () => action(POST_SAVE_NEW_ORDER.REQUEST),
  success: (data) => action(POST_SAVE_NEW_ORDER.SUCCESS, data),
  failure: (error) => action(POST_SAVE_NEW_ORDER.FAILURE, error),
};


export const CANCEL_ORDER = 'CANCEL_ORDER';
export const cancelOrder = data => action(CANCEL_ORDER, data);

export const POST_CANCEL_ORDER = createRequestTypes('POST_CANCEL_ORDER');
export const postCancelOrder = {
  request: () => action(POST_CANCEL_ORDER.REQUEST),
  success: (data) => action(POST_CANCEL_ORDER.SUCCESS, data),
  failure: (error) => action(POST_CANCEL_ORDER.FAILURE, error),
};

export const TAKE_ORDER = 'TAKE_ORDER';
export const takeOrder = data => action(TAKE_ORDER, data);

export const POST_TAKE_ORDER = createRequestTypes('POST_TAKE_ORDER');
export const postTakeOrder = {
  request: () => action(POST_TAKE_ORDER.REQUEST),
  success: (data) => action(POST_TAKE_ORDER.SUCCESS, data),
  failure: (error) => action(POST_TAKE_ORDER.FAILURE, error),
};



export const SET_NEW_TOKEN_DEPOSIT_VALUE = 'SET_NEW_TOKEN_DEPOSIT_VALUE';
export const setNewTokenDepositValue = data => action(SET_NEW_TOKEN_DEPOSIT_VALUE, data);

export const SAVE_NEW_TOKEN_DEPOSIT = 'SAVE_NEW_TOKEN_DEPOSIT';
export const saveNewTokenDeposit = data => action(SAVE_NEW_TOKEN_DEPOSIT, data);

export const POST_SAVE_NEW_TOKEN_DEPOSIT = createRequestTypes('POST_SAVE_NEW_TOKEN_DEPOSIT');
export const postSaveNewTokenDeposit = {
  request: () => action(POST_SAVE_NEW_TOKEN_DEPOSIT.REQUEST),
  success: (data) => action(POST_SAVE_NEW_TOKEN_DEPOSIT.SUCCESS, data),
  failure: (error) => action(POST_SAVE_NEW_TOKEN_DEPOSIT.FAILURE, error),
};

export const SET_NEW_TOKEN_WITHDRAWAL_VALUE = 'SET_NEW_TOKEN_WITHDRAWAL_VALUE';
export const setNewTokenWithdrawalValue = data => action(SET_NEW_TOKEN_WITHDRAWAL_VALUE, data);

export const SAVE_NEW_TOKEN_WITHDRAWAL = 'SAVE_NEW_TOKEN_WITHDRAWAL';
export const saveNewTokenWithdrawal = data => action(SAVE_NEW_TOKEN_WITHDRAWAL, data);

export const POST_SAVE_NEW_TOKEN_WITHDRAWAL = createRequestTypes('POST_SAVE_NEW_TOKEN_WITHDRAWAL');
export const postSaveNewTokenWithdrawal = {
  request: () => action(POST_SAVE_NEW_TOKEN_WITHDRAWAL.REQUEST),
  success: (data) => action(POST_SAVE_NEW_TOKEN_WITHDRAWAL.SUCCESS, data),
  failure: (error) => action(POST_SAVE_NEW_TOKEN_WITHDRAWAL.FAILURE, error),
};

export const SET_NEW_CRWD_DEPOSIT_VALUE = 'SET_NEW_CRWD_DEPOSIT_VALUE';
export const setNewCrwdDepositValue = data => action(SET_NEW_CRWD_DEPOSIT_VALUE, data);

export const SAVE_NEW_CRWD_DEPOSIT = 'SAVE_NEW_CRWD_DEPOSIT';
export const saveNewCrwdDeposit = data => action(SAVE_NEW_CRWD_DEPOSIT, data);

export const POST_SAVE_NEW_CRWD_DEPOSIT = createRequestTypes('POST_SAVE_NEW_CRWD_DEPOSIT');
export const postSaveNewCrwdDeposit = {
  request: () => action(POST_SAVE_NEW_CRWD_DEPOSIT.REQUEST),
  success: (data) => action(POST_SAVE_NEW_CRWD_DEPOSIT.SUCCESS, data),
  failure: (error) => action(POST_SAVE_NEW_CRWD_DEPOSIT.FAILURE, error),
};

export const SET_NEW_CRWD_WITHDRAWAL_VALUE = 'SET_NEW_CRWD_WITHDRAWAL_VALUE';
export const setNewCrwdWithdrawalValue = data => action(SET_NEW_CRWD_WITHDRAWAL_VALUE, data);

export const SAVE_NEW_CRWD_WITHDRAWAL = 'SAVE_NEW_CRWD_WITHDRAWAL';
export const saveNewCrwdWithdrawal = data => action(SAVE_NEW_CRWD_WITHDRAWAL, data);

export const POST_SAVE_NEW_CRWD_WITHDRAWAL = createRequestTypes('POST_SAVE_NEW_CRWD_WITHDRAWAL');
export const postSaveNewCrwdWithdrawal = {
  request: () => action(POST_SAVE_NEW_CRWD_WITHDRAWAL.REQUEST),
  success: (data) => action(POST_SAVE_NEW_CRWD_WITHDRAWAL.SUCCESS, data),
  failure: (error) => action(POST_SAVE_NEW_CRWD_WITHDRAWAL.FAILURE, error),
};