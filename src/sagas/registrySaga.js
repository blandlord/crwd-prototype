import {call, put, all, takeEvery, select} from 'redux-saga/effects';

import * as registryActions from '../actions/registryActions';
import * as web3Actions from '../actions/web3Actions';
import * as notificationActions from '../actions/notificationActions';

import registryService from '../utils/registryService';

function* saveNewUserData(data) {
  yield put(registryActions.postSaveNewUserData.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));
    const newUserData = yield select(state => state.registryStore.get("newUserData"));
    const results = yield call(registryService.addUserAddress, web3, newUserData);
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
    yield put(registryActions.fetchLoadUsersData.success({usersData}));
  } catch (error) {
    yield put(registryActions.fetchLoadUsersData.failure({error}));
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

function* watchSetupWeb3Success() {
  yield takeEvery(web3Actions.SETUP_WEB3.SUCCESS, loadUsersData);
}

export default function* registrySaga() {
  yield all([
    watchSaveNewUserData(),
    watchLoadUsersData(),
    watchSetState(),
    watchPostSaveNewUserDataSuccess(),
    watchPostSetStateSuccess(),
    watchSetupWeb3Success(),
  ]);
}