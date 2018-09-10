import {call, put, all, takeEvery, select} from 'redux-saga/effects';
import { delay } from 'redux-saga'

import * as registryActions from '../actions/registryActions';
import * as web3Actions from '../actions/web3Actions';
import * as notificationActions from '../actions/notificationActions';

import registryService from '../utils/registryService';
import logWatchService from "../utils/logWatchService";

function* saveNewUserData(data) {
  yield put(registryActions.postSaveNewUserData.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));
    const newUserData = yield select(state => state.registryStore.get("newUserData"));
    const results = yield call(registryService.addUserAddress, web3, newUserData);

    // delay to allow changes to be committed to local node
    yield delay(1000);

    yield put(registryActions.postSaveNewUserData.success({results}));

    console.log("saveNewUserData TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'new user data saved',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(registryActions.postSaveNewUserData.failure({error}));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to save new user data',
        message: error.message,
        position: 'br'
      }
    }));
  }
}

function* loadUsersData(data) {
  yield put(registryActions.fetchLoadUsersData.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));
    const usersData = yield call(registryService.loadUsersData, web3);
    const currentUserData = yield call(registryService.loadCurrentUserData, web3);
    yield put(registryActions.fetchLoadUsersData.success({usersData, currentUserData}));
  } catch (error) {
    yield put(registryActions.fetchLoadUsersData.failure({error}));
  }
}

function* loadOwnerAddress(data) {
  yield put(registryActions.fetchLoadOwnerAddress.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));
    const ownerAddress = yield call(registryService.loadOwnerAddress, web3);
    yield put(registryActions.fetchLoadOwnerAddress.success({ownerAddress}));
  } catch (error) {
    yield put(registryActions.fetchLoadOwnerAddress.failure({error}));
  }
}

function* setState(data) {
  yield put(registryActions.postSetState.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));
    const results = yield call(registryService.setState, web3, data.userAddress, data.state);
    yield put(registryActions.postSetState.success({results}));

    console.log("setState TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'User Data State Set Successfully',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(registryActions.postSetState.failure({error}));
    yield put(notificationActions.error({
      notification: {
        title: 'Failed to Set User Data State',
        message: error.message,
        position: 'br'
      }
    }));
  }
}


function* saveNewNotaryData(data) {
  yield put(registryActions.postSaveNewNotaryData.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));
    const newNotaryData = yield select(state => state.registryStore.get("newNotaryData"));
    const results = yield call(registryService.addNotary, web3, newNotaryData);

    // delay to allow changes to be committed to local node
    yield delay(1000);

    yield put(registryActions.postSaveNewNotaryData.success({results}));

    console.log("saveNewNotaryData TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'new notary saved',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(registryActions.postSaveNewNotaryData.failure({error}));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to save new notary',
        message: error.message,
        position: 'br'
      }
    }));
  }
}

function* loadNotariesData(data) {
  yield put(registryActions.fetchLoadNotariesData.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));
    const notariesData = yield call(registryService.loadNotariesData, web3);
    yield put(registryActions.fetchLoadNotariesData.success({notariesData}));
  } catch (error) {
    yield put(registryActions.fetchLoadNotariesData.failure({error}));
  }
}

function* startNotaryLogWatch(data) {
  const web3 = yield select(state => state.web3Store.get("web3"));
  yield call(logWatchService.startNotaryLogWatch, web3);
}

function* stopNotaryLogWatch(data) {
  const web3 = yield select(state => state.web3Store.get("web3"));
  yield call(logWatchService.stopNotaryLogWatch, web3);
}

function* watchSaveNewUserData() {
  yield takeEvery(registryActions.SAVE_NEW_USER_DATA, saveNewUserData);
}

function* watchLoadUsersData() {
  yield takeEvery(registryActions.LOAD_USERS_DATA, loadUsersData);
}

function* watchSetState() {
  yield takeEvery(registryActions.SET_STATE, setState);
}

function* watchPostSaveNewUserDataSuccess() {
  yield takeEvery(registryActions.POST_SAVE_NEW_USER_DATA.SUCCESS, loadUsersData);
}

function* watchPostSetStateSuccess() {
  yield takeEvery(registryActions.POST_SET_STATE.SUCCESS, loadUsersData);
}

function* watchSaveNewNotaryData() {
  yield takeEvery(registryActions.SAVE_NEW_NOTARY_DATA, saveNewNotaryData);
}

function* watchPostSaveNewNotaryDataSuccess() {
  yield takeEvery(registryActions.POST_SAVE_NEW_NOTARY_DATA.SUCCESS, loadNotariesData);
}

function* watchLoadNotariesData() {
  yield takeEvery(registryActions.LOAD_NOTARIES_DATA, loadNotariesData);
}

function* watchSetupWeb3Success() {
  yield takeEvery(web3Actions.SETUP_WEB3.SUCCESS, loadUsersData);
  yield takeEvery(web3Actions.SETUP_WEB3.SUCCESS, loadOwnerAddress);
  yield takeEvery(web3Actions.SETUP_WEB3.SUCCESS, loadNotariesData);
}

function* watchStartNotaryLogWatch() {
  yield takeEvery(registryActions.START_NOTARY_LOG_WATCH, startNotaryLogWatch);
}

function* watchStopNotaryLogWatch() {
  yield takeEvery(registryActions.STOP_NOTARY_LOG_WATCH, stopNotaryLogWatch);
}

export default function* registrySaga() {
  yield all([
    watchSaveNewUserData(),
    watchLoadUsersData(),
    watchSetState(),
    watchPostSaveNewUserDataSuccess(),
    watchPostSetStateSuccess(),
    watchSaveNewNotaryData(),
    watchPostSaveNewNotaryDataSuccess(),
    watchLoadNotariesData(),
    watchSetupWeb3Success(),
    watchStartNotaryLogWatch(),
    watchStopNotaryLogWatch(),
  ]);
}