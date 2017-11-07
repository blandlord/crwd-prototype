import {call, put, all, takeEvery, select} from 'redux-saga/effects';
import {delay} from 'redux-saga'

import * as crowdOwnedActions from '../actions/crowdOwnedActions';
import * as web3Actions from '../actions/web3Actions';
import * as notificationActions from '../actions/notificationActions';

import crowdOwnedService from '../utils/crowdOwnedService';


function* saveNewCrowdOwnedContract(data) {
  yield put(crowdOwnedActions.postSaveNewCrowdOwnedContract.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));
    const newCrowdOwnedContract = yield select(state => state.crowdOwnedStore.get("newCrowdOwnedContract"));
    const results = yield call(crowdOwnedService.deployCrowdOwned, web3, newCrowdOwnedContract);

    // delay to allow changes to be committed to local node
    yield delay(1000);

    yield put(crowdOwnedActions.postSaveNewCrowdOwnedContract.success({results}));

    console.log("saveNewCrowdOwnedContract TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'new crowd owned contract deployed',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(crowdOwnedActions.postSaveNewCrowdOwnedContract.failure({error}));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to deploy new crowd owned contract',
        message: error.message,
        position: 'br'
      }
    }));
  }
}


function* loadCrowdOwnedContracts(data) {
  yield put(crowdOwnedActions.fetchLoadCrowdOwnedContracts.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));
    let crowdOwnedContracts = yield call(crowdOwnedService.loadCrowdOwnedContracts, web3);
    crowdOwnedContracts = yield call(crowdOwnedService.loadOwnershipData, web3, crowdOwnedContracts);

    yield put(crowdOwnedActions.fetchLoadCrowdOwnedContracts.success({crowdOwnedContracts}));
  } catch (error) {
    yield put(crowdOwnedActions.fetchLoadCrowdOwnedContracts.failure({error}));
  }
}


function* watchSaveNewCrowdOwnedContract() {
  yield takeEvery(crowdOwnedActions.SAVE_NEW_CROWD_OWNED_CONTRACT, saveNewCrowdOwnedContract);
}


function* watchPostSaveNewCrowdOwnedContractSuccess() {
  yield takeEvery(crowdOwnedActions.POST_SAVE_NEW_CROWD_OWNED_CONTRACT.SUCCESS, loadCrowdOwnedContracts);
}

function* watchSetupWeb3Success() {
  yield takeEvery(web3Actions.SETUP_WEB3.SUCCESS, loadCrowdOwnedContracts);
}


export default function* crowdOwnedSaga() {
  yield all([
    watchSaveNewCrowdOwnedContract(),
    watchPostSaveNewCrowdOwnedContractSuccess(),
    watchSetupWeb3Success(),
  ]);
}