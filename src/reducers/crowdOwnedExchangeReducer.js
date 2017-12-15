import {Map as ImmutableMap} from 'immutable';

let initialData = {
  crowdOwnedContractSummary: null,
  orders: [],
  balances: {},
  newOrder: {
    tokenAddress: null,
    orderType: 0,
    price: 0,
    amount: 0,
  },
  newTokenDepositValue: 0,
  newTokenWithdrawalValue: 0,
  newCrwdDepositValue: 0,
  newCrwdWithdrawalValue: 0,
};

export default function crowdOwnedExchangeReducer(state = new ImmutableMap(initialData), action) {

  const loadCrowdOwnedContractSummary = (state) => {
    return state
      .set('crowdOwnedContractSummary', null);
  };

  const fetchLoadCrowdOwnedContractSummaryRequest = (state) => {
    return state
      .set('loadingCrowdOwnedContractSummary', true);
  };

  const fetchLoadCrowdOwnedContractSummarySuccess = (state) => {
    return state
      .set('loadingCrowdOwnedContractSummary', false)
      .set('crowdOwnedContractSummary', action.crowdOwnedContractSummary);
  };

  const fetchLoadCrowdOwnedContractSummaryFailure = (state) => {
    return state
      .set('loadingCrowdOwnedContractSummary', false);
  };


  const fetchLoadOrdersRequest = (state) => {
    return state
      .set('loadingOrders', true);
  };

  const fetchLoadOrdersSuccess = (state) => {
    return state
      .set('loadingOrders', false)
      .set('orders', action.orders);
  };

  const fetchLoadOrdersFailure = (state) => {
    return state
      .set('loadingOrders', false);
  };

  const fetchLoadBalancesRequest = (state) => {
    return state
      .set('loadingBalances', true);
  };

  const fetchLoadBalancesSuccess = (state) => {
    return state
      .set('loadingBalances', false)
      .set('balances', action.balances);
  };

  const fetchLoadBalancesFailure = (state) => {
    return state
      .set('loadingBalances', false);
  };

  const setNewOrder = (state) => {
    return state
      .set('newOrder', action.newOrder);
  };

  const postSaveNewOrderRequest = (state) => {
    return state
      .set('savingNewOrder', true);
  };

  const postSaveNewOrderSuccess = (state) => {
    return state
      .set('savingNewOrder', false)
      .set('newOrder', initialData.newOrder);
  };

  const postSaveNewOrderFailure = (state) => {
    return state
      .set('savingNewOrder', false);
  };

  const postCancelOrderRequest = (state) => {
    return state
      .set('cancellingOrder', action.orderId);
  };

  const postCancelOrderSuccess = (state) => {
    return state
      .set('cancellingOrder', null);
  };

  const postCancelOrderFailure = (state) => {
    return state
      .set('cancellingOrder', null);
  };

  const postTakeOrderRequest = (state) => {
    return state
      .set('takingOrder', action.orderId);
  };

  const postTakeOrderSuccess = (state) => {
    return state
      .set('takingOrder', null);
  };

  const postTakeOrderFailure = (state) => {
    return state
      .set('takingOrder', null);
  };


  const setNewTokenDepositValue = (state) => {
    return state
      .set('newTokenDepositValue', action.newTokenDepositValue);
  };

  const postSaveNewTokenDepositRequest = (state) => {
    return state
      .set('savingNewTokenDeposit', true);
  };

  const postSaveNewTokenDepositSuccess = (state) => {
    return state
      .set('savingNewTokenDeposit', false)
      .set('newTokenDepositValue', 0);
  };

  const postSaveNewTokenDepositFailure = (state) => {
    return state
      .set('savingNewTokenDeposit', false);
  };

  const setNewTokenWithdrawalValue = (state) => {
    return state
      .set('newTokenWithdrawalValue', action.newTokenWithdrawalValue);
  };

  const postSaveNewTokenWithdrawalRequest = (state) => {
    return state
      .set('savingNewTokenWithdrawal', true);
  };

  const postSaveNewTokenWithdrawalSuccess = (state) => {
    return state
      .set('savingNewTokenWithdrawal', false)
      .set('newTokenWithdrawalValue', 0);
  };

  const postSaveNewTokenWithdrawalFailure = (state) => {
    return state
      .set('savingNewTokenWithdrawal', false);
  };

  const setNewCrwdDepositValue = (state) => {
    return state
      .set('newCrwdDepositValue', action.newCrwdDepositValue);
  };

  const postSaveNewCrwdDepositRequest = (state) => {
    return state
      .set('savingNewCrwdDeposit', true);
  };

  const postSaveNewCrwdDepositSuccess = (state) => {
    return state
      .set('savingNewCrwdDeposit', false)
      .set('newCrwdDepositValue', 0);
  };

  const postSaveNewCrwdDepositFailure = (state) => {
    return state
      .set('savingNewCrwdDeposit', false);
  };

  const setNewCrwdWithdrawalValue = (state) => {
    return state
      .set('newCrwdWithdrawalValue', action.newCrwdWithdrawalValue);
  };

  const postSaveNewCrwdWithdrawalRequest = (state) => {
    return state
      .set('savingNewCrwdWithdrawal', true);
  };

  const postSaveNewCrwdWithdrawalSuccess = (state) => {
    return state
      .set('savingNewCrwdWithdrawal', false)
      .set('newCrwdWithdrawalValue', 0);
  };

  const postSaveNewCrwdWithdrawalFailure = (state) => {
    return state
      .set('savingNewCrwdWithdrawal', false);
  };

  const actions = {
    'LOAD_CROWD_OWNED_CONTRACT_SUMMARY': () => loadCrowdOwnedContractSummary(state),
    'FETCH_LOAD_CROWD_OWNED_CONTRACT_SUMMARY_REQUEST': () => fetchLoadCrowdOwnedContractSummaryRequest(state),
    'FETCH_LOAD_CROWD_OWNED_CONTRACT_SUMMARY_SUCCESS': () => fetchLoadCrowdOwnedContractSummarySuccess(state),
    'FETCH_LOAD_CROWD_OWNED_CONTRACT_SUMMARY_FAILURE': () => fetchLoadCrowdOwnedContractSummaryFailure(state),
    'FETCH_LOAD_ORDERS_REQUEST': () => fetchLoadOrdersRequest(state),
    'FETCH_LOAD_ORDERS_SUCCESS': () => fetchLoadOrdersSuccess(state),
    'FETCH_LOAD_ORDERS_FAILURE': () => fetchLoadOrdersFailure(state),
    'FETCH_LOAD_BALANCES_REQUEST': () => fetchLoadBalancesRequest(state),
    'FETCH_LOAD_BALANCES_SUCCESS': () => fetchLoadBalancesSuccess(state),
    'FETCH_LOAD_BALANCES_FAILURE': () => fetchLoadBalancesFailure(state),
    'SET_NEW_ORDER': () => setNewOrder(state),
    'POST_SAVE_NEW_ORDER_REQUEST': () => postSaveNewOrderRequest(state),
    'POST_SAVE_NEW_ORDER_SUCCESS': () => postSaveNewOrderSuccess(state),
    'POST_SAVE_NEW_ORDER_FAILURE': () => postSaveNewOrderFailure(state),
    'POST_CANCEL_ORDER_REQUEST': () => postCancelOrderRequest(state),
    'POST_CANCEL_ORDER_SUCCESS': () => postCancelOrderSuccess(state),
    'POST_CANCEL_ORDER_FAILURE': () => postCancelOrderFailure(state),
    'POST_TAKE_ORDER_REQUEST': () => postTakeOrderRequest(state),
    'POST_TAKE_ORDER_SUCCESS': () => postTakeOrderSuccess(state),
    'POST_TAKE_ORDER_FAILURE': () => postTakeOrderFailure(state),
    'SET_NEW_TOKEN_DEPOSIT_VALUE': () => setNewTokenDepositValue(state),
    'POST_SAVE_NEW_TOKEN_DEPOSIT_REQUEST': () => postSaveNewTokenDepositRequest(state),
    'POST_SAVE_NEW_TOKEN_DEPOSIT_SUCCESS': () => postSaveNewTokenDepositSuccess(state),
    'POST_SAVE_NEW_TOKEN_DEPOSIT_FAILURE': () => postSaveNewTokenDepositFailure(state),
    'SET_NEW_TOKEN_WITHDRAWAL_VALUE': () => setNewTokenWithdrawalValue(state),
    'POST_SAVE_NEW_TOKEN_WITHDRAWAL_REQUEST': () => postSaveNewTokenWithdrawalRequest(state),
    'POST_SAVE_NEW_TOKEN_WITHDRAWAL_SUCCESS': () => postSaveNewTokenWithdrawalSuccess(state),
    'POST_SAVE_NEW_TOKEN_WITHDRAWAL_FAILURE': () => postSaveNewTokenWithdrawalFailure(state),
    'SET_NEW_CRWD_DEPOSIT_VALUE': () => setNewCrwdDepositValue(state),
    'POST_SAVE_NEW_CRWD_DEPOSIT_REQUEST': () => postSaveNewCrwdDepositRequest(state),
    'POST_SAVE_NEW_CRWD_DEPOSIT_SUCCESS': () => postSaveNewCrwdDepositSuccess(state),
    'POST_SAVE_NEW_CRWD_DEPOSIT_FAILURE': () => postSaveNewCrwdDepositFailure(state),
    'SET_NEW_CRWD_WITHDRAWAL_VALUE': () => setNewCrwdWithdrawalValue(state),
    'POST_SAVE_NEW_CRWD_WITHDRAWAL_REQUEST': () => postSaveNewCrwdWithdrawalRequest(state),
    'POST_SAVE_NEW_CRWD_WITHDRAWAL_SUCCESS': () => postSaveNewCrwdWithdrawalSuccess(state),
    'POST_SAVE_NEW_CRWD_WITHDRAWAL_FAILURE': () => postSaveNewCrwdWithdrawalFailure(state),

    'DEFAULT': () => state
  };

  return ((action && actions[action.type]) ? actions[action.type] : actions['DEFAULT'])()
}