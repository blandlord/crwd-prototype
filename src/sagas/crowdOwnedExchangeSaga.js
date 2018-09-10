import {call, put, all, takeEvery, select} from 'redux-saga/effects';
import {delay} from 'redux-saga'

import * as crowdOwnedExchangeActions from '../actions/crowdOwnedExchangeActions';
import * as notificationActions from '../actions/notificationActions';

import crowdOwnedService from '../utils/crowdOwnedService';
import crowdOwnedExchangeService from '../utils/crowdOwnedExchangeService';
import logWatchService from "../utils/logWatchService";

function* loadCrowdOwnedContractSummary(data) {
  yield put(crowdOwnedExchangeActions.fetchLoadCrowdOwnedContractSummary.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));
    let crowdOwnedContractSummary = yield call(crowdOwnedService.loadCrowdOwnedContractSummary, web3, data.crowdOwnedAddress);

    yield put(crowdOwnedExchangeActions.fetchLoadCrowdOwnedContractSummary.success({crowdOwnedContractSummary}));
  } catch (error) {
    yield put(crowdOwnedExchangeActions.fetchLoadCrowdOwnedContractSummary.failure({error}));
  }
}


function* loadOrders(data) {
  yield put(crowdOwnedExchangeActions.fetchLoadOrders.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));

    let crowdOwnedAddress = data.crowdOwnedAddress;
    if (!crowdOwnedAddress) {
      // address not passed, get from contract summary in store
      crowdOwnedAddress = yield select(state => state.crowdOwnedExchangeStore.get("crowdOwnedContractSummary").address);
    }

    let orders = yield call(crowdOwnedExchangeService.loadOrders, web3, crowdOwnedAddress);

    yield put(crowdOwnedExchangeActions.fetchLoadOrders.success({orders}));
  } catch (error) {
    yield put(crowdOwnedExchangeActions.fetchLoadOrders.failure({error}));
  }
}

function* loadBalances(data) {
  yield put(crowdOwnedExchangeActions.fetchLoadBalances.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));

    let crowdOwnedAddress = data.crowdOwnedAddress;
    if (!crowdOwnedAddress) {
      // address not passed, get from contract summary in store
      crowdOwnedAddress = yield select(state => state.crowdOwnedExchangeStore.get("crowdOwnedContractSummary").address);
    }

    const balances = yield call(crowdOwnedExchangeService.loadBalances, web3, crowdOwnedAddress);

    yield put(crowdOwnedExchangeActions.fetchLoadBalances.success({balances}));
  } catch (error) {
    yield put(crowdOwnedExchangeActions.fetchLoadBalances.failure({error}));
  }
}

function* saveNewOrder(data) {
  yield put(crowdOwnedExchangeActions.postSaveNewOrder.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));
    const newOrder = yield select(state => state.crowdOwnedExchangeStore.get("newOrder"));

    newOrder.fullDecimalsPrice = parseFloat(newOrder.price) * Math.pow(10, 18); // 18 decimals for CRWD
    newOrder.amount = parseInt(newOrder.amount, 10);

    const results = yield call(crowdOwnedExchangeService.createOrder, web3, newOrder);

    // delay to allow changes to be committed to local node
    yield delay(1000);

    yield put(crowdOwnedExchangeActions.postSaveNewOrder.success({results}));

    console.log("saveNewOrder TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'new order saved successfully',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(crowdOwnedExchangeActions.postSaveNewOrder.failure({error}));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to save order',
        message: error.message,
        position: 'br'
      }
    }));
  }
}

function* cancelOrder(data) {
  yield put(crowdOwnedExchangeActions.postCancelOrder.request({orderId: data.orderId}));
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));

    const results = yield call(crowdOwnedExchangeService.cancelOrder, web3, data.crowdOwnedAddress, data.orderId);

    // delay to allow changes to be committed to local node
    yield delay(1000);

    yield put(crowdOwnedExchangeActions.postCancelOrder.success({results}));

    console.log("cancelOrder TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'order cancelled successfully',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(crowdOwnedExchangeActions.postCancelOrder.failure({error}));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to cancel order',
        message: error.message,
        position: 'br'
      }
    }));
  }
}

function* takeOrder(data) {
  yield put(crowdOwnedExchangeActions.postTakeOrder.request({orderId: data.order.id}));
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));

    const results = yield call(crowdOwnedExchangeService.takeOrder, web3, data.crowdOwnedAddress, data.order);

    // delay to allow changes to be committed to local node
    yield delay(1000);

    yield put(crowdOwnedExchangeActions.postTakeOrder.success({results}));

    console.log("takeOrder TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'order taken successfully',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(crowdOwnedExchangeActions.postTakeOrder.failure({error}));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to take order',
        message: error.message,
        position: 'br'
      }
    }));
  }
}


function* saveNewTokenDeposit(data) {
  yield put(crowdOwnedExchangeActions.postSaveNewTokenDeposit.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));

    const newTokenDepositValue = yield select(state => state.crowdOwnedExchangeStore.get("newTokenDepositValue"));
    let parseNewTokenDepositValue = parseInt(newTokenDepositValue, 10);   // no decimals for CrowdOwned

    const results = yield call(crowdOwnedExchangeService.depositCrowdOwnedTokens, web3, data.crowdOwnedAddress, parseNewTokenDepositValue);

    // delay to allow changes to be committed to local node
    yield delay(1000);

    yield put(crowdOwnedExchangeActions.postSaveNewTokenDeposit.success({results}));

    console.log("saveNewTokenDeposit TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'new token deposit saved successfully',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(crowdOwnedExchangeActions.postSaveNewTokenDeposit.failure({error}));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to save token deposit',
        message: error.message,
        position: 'br'
      }
    }));
  }
}

function* saveNewCrwdDeposit(data) {
  yield put(crowdOwnedExchangeActions.postSaveNewCrwdDeposit.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));

    const newCrwdDepositValue = yield select(state => state.crowdOwnedExchangeStore.get("newCrwdDepositValue"));
    let parseNewCrwdDepositValue = parseFloat(newCrwdDepositValue) * Math.pow(10, 18);   // 18 decimals for CRWD

    const results = yield call(crowdOwnedExchangeService.depositCRWDTokens, web3, parseNewCrwdDepositValue);

    // delay to allow changes to be committed to local node
    yield delay(1000);

    yield put(crowdOwnedExchangeActions.postSaveNewCrwdDeposit.success({results}));

    console.log("saveNewCrwdDeposit TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'new crwd deposit saved successfully',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(crowdOwnedExchangeActions.postSaveNewCrwdDeposit.failure({error}));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to save crwd deposit',
        message: error.message,
        position: 'br'
      }
    }));
  }
}

function* saveNewTokenWithdrawal(data) {
  yield put(crowdOwnedExchangeActions.postSaveNewTokenWithdrawal.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));

    const newTokenWithdrawalValue = yield select(state => state.crowdOwnedExchangeStore.get("newTokenWithdrawalValue"));
    let parseNewTokenWithdrawalValue = parseInt(newTokenWithdrawalValue, 10);   // no decimals for CrowdOwned

    const results = yield call(crowdOwnedExchangeService.withdrawCrowdOwnedTokens, web3, data.crowdOwnedAddress, parseNewTokenWithdrawalValue);

    // delay to allow changes to be committed to local node
    yield delay(1000);

    yield put(crowdOwnedExchangeActions.postSaveNewTokenWithdrawal.success({results}));

    console.log("saveNewTokenWithdrawal TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'new token withdrawal saved successfully',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(crowdOwnedExchangeActions.postSaveNewTokenWithdrawal.failure({error}));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to save token withdrawal',
        message: error.message,
        position: 'br'
      }
    }));
  }
}

function* saveNewCrwdWithdrawal(data) {
  yield put(crowdOwnedExchangeActions.postSaveNewCrwdWithdrawal.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));

    const newCrwdWithdrawalValue = yield select(state => state.crowdOwnedExchangeStore.get("newCrwdWithdrawalValue"));
    let parseNewCrwdWithdrawalValue = parseFloat(newCrwdWithdrawalValue) * Math.pow(10, 18);   // 18 decimals for CRWD

    const results = yield call(crowdOwnedExchangeService.withdrawCRWDTokens, web3, parseNewCrwdWithdrawalValue);

    // delay to allow changes to be committed to local node
    yield delay(1000);

    yield put(crowdOwnedExchangeActions.postSaveNewCrwdWithdrawal.success({results}));

    console.log("saveNewCrwdWithdrawal TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'new crwd withdrawal saved successfully',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(crowdOwnedExchangeActions.postSaveNewCrwdWithdrawal.failure({error}));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to save crwd withdrawal',
        message: error.message,
        position: 'br'
      }
    }));
  }
}

function* startCrowdOwnedExchangeLogWatch(data) {
  const web3 = yield select(state => state.web3Store.get("web3"));
  yield call(logWatchService.startCrowdOwnedExchangeLogWatch, web3, data.crowdOwnedAddress);
}

function* stopCrowdOwnedExchangeLogWatch(data) {
  const web3 = yield select(state => state.web3Store.get("web3"));
  yield call(logWatchService.stopCrowdOwnedExchangeLogWatch, web3);
}


function* watchLoadCrowdOwnedContract() {
  yield takeEvery(crowdOwnedExchangeActions.LOAD_CROWD_OWNED_CONTRACT_SUMMARY, loadCrowdOwnedContractSummary);
}

function* watchLoadOrders() {
  yield takeEvery(crowdOwnedExchangeActions.LOAD_ORDERS, loadOrders);
}

function* watchLoadBalances() {
  yield takeEvery(crowdOwnedExchangeActions.LOAD_BALANCES, loadBalances);
}

function* watchSaveNewOrder() {
  yield takeEvery(crowdOwnedExchangeActions.SAVE_NEW_ORDER, saveNewOrder);
}

function* watchCancelOrder() {
  yield takeEvery(crowdOwnedExchangeActions.CANCEL_ORDER, cancelOrder);
}

function* watchTakeOrder() {
  yield takeEvery(crowdOwnedExchangeActions.TAKE_ORDER, takeOrder);
}

function* watchSaveNewTokenDeposit() {
  yield takeEvery(crowdOwnedExchangeActions.SAVE_NEW_TOKEN_DEPOSIT, saveNewTokenDeposit);
}

function* watchSaveNewTokenWithdrawal() {
  yield takeEvery(crowdOwnedExchangeActions.SAVE_NEW_TOKEN_WITHDRAWAL, saveNewTokenWithdrawal);
}

function* watchSaveNewCrwdDeposit() {
  yield takeEvery(crowdOwnedExchangeActions.SAVE_NEW_CRWD_DEPOSIT, saveNewCrwdDeposit);
}

function* watchSaveNewCrwdWithdrawal() {
  yield takeEvery(crowdOwnedExchangeActions.SAVE_NEW_CRWD_WITHDRAWAL, saveNewCrwdWithdrawal);
}

function* watchPostSaveNewOrderSuccess() {
  yield takeEvery(crowdOwnedExchangeActions.POST_SAVE_NEW_ORDER.SUCCESS, loadOrders);
  yield takeEvery(crowdOwnedExchangeActions.POST_SAVE_NEW_ORDER.SUCCESS, loadBalances);
}

function* watchPostCancelOrderSuccess() {
  yield takeEvery(crowdOwnedExchangeActions.POST_CANCEL_ORDER.SUCCESS, loadOrders);
  yield takeEvery(crowdOwnedExchangeActions.POST_CANCEL_ORDER.SUCCESS, loadBalances);
}

function* watchPostTakeOrderSuccess() {
  yield takeEvery(crowdOwnedExchangeActions.POST_TAKE_ORDER.SUCCESS, loadOrders);
  yield takeEvery(crowdOwnedExchangeActions.POST_TAKE_ORDER.SUCCESS, loadBalances);
}

function* watchPostSaveNewTokenDepositSuccess() {
  yield takeEvery(crowdOwnedExchangeActions.POST_SAVE_NEW_TOKEN_DEPOSIT.SUCCESS, loadBalances);
}

function* watchPostSaveNewTokenWithdrawalSuccess() {
  yield takeEvery(crowdOwnedExchangeActions.POST_SAVE_NEW_TOKEN_WITHDRAWAL.SUCCESS, loadBalances);
}

function* watchPostSaveNewCrwdDepositSuccess() {
  yield takeEvery(crowdOwnedExchangeActions.POST_SAVE_NEW_CRWD_DEPOSIT.SUCCESS, loadBalances);
}

function* watchPostSaveNewCrwdWithdrawalSuccess() {
  yield takeEvery(crowdOwnedExchangeActions.POST_SAVE_NEW_CRWD_WITHDRAWAL.SUCCESS, loadBalances);
}

function* watchStartCrowdOwnedExchangeLogWatch() {
  yield takeEvery(crowdOwnedExchangeActions.START_CROWD_OWNED_EXCHANGE_LOG_WATCH, startCrowdOwnedExchangeLogWatch);
}

function* watchStopCrowdOwnedExchangeLogWatch() {
  yield takeEvery(crowdOwnedExchangeActions.STOP_CROWD_OWNED_EXCHANGE_LOG_WATCH, stopCrowdOwnedExchangeLogWatch);
}

export default function* crowdOwnedExchangeSaga() {
  yield all([
    watchLoadCrowdOwnedContract(),
    watchLoadOrders(),
    watchLoadBalances(),
    watchSaveNewOrder(),
    watchPostSaveNewOrderSuccess(),
    watchCancelOrder(),
    watchPostCancelOrderSuccess(),
    watchTakeOrder(),
    watchPostTakeOrderSuccess(),
    watchSaveNewTokenDeposit(),
    watchPostSaveNewTokenDepositSuccess(),
    watchSaveNewTokenWithdrawal(),
    watchPostSaveNewTokenWithdrawalSuccess(),
    watchSaveNewCrwdDeposit(),
    watchPostSaveNewCrwdDepositSuccess(),
    watchSaveNewCrwdWithdrawal(),
    watchPostSaveNewCrwdWithdrawalSuccess(),
    watchStartCrowdOwnedExchangeLogWatch(),
    watchStopCrowdOwnedExchangeLogWatch(),
  ]);
}