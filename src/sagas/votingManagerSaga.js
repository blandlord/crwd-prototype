import {call, put, all, takeEvery, select} from 'redux-saga/effects';
import {delay} from 'redux-saga'

import * as votingManagerActions from '../actions/votingManagerActions';
import * as notificationActions from '../actions/notificationActions';

import votingManagerService from '../utils/votingManagerService';

function* saveNewProposal(data) {
  yield put(votingManagerActions.postSaveNewProposal.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));
    const newProposal = yield select(state => state.votingManagerStore.get("newProposal"));

    // convert duration to seconds
    newProposal.duration = parseInt(newProposal.durationInDays * 24 * 3600, 10);

    const results = yield call(votingManagerService.createProposal, web3, newProposal);

    // delay to allow changes to be committed to local node
    yield delay(1000);

    yield put(votingManagerActions.postSaveNewProposal.success({
      results,
      crowdOwnedAddress: newProposal.crowdOwnedAddress
    }));

    console.log("saveNewProposal TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'new proposal saved',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(votingManagerActions.postSaveNewProposal.failure({ error }));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to save new proposal',
        message: error.message,
        position: 'br'
      }
    }));
  }
}


function* loadProposals(data) {
  yield put(votingManagerActions.fetchLoadProposals.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));
    let proposals = yield call(votingManagerService.loadProposals, web3, data.crowdOwnedAddress);

    yield put(votingManagerActions.fetchLoadProposals.success({ proposals }));
  } catch (error) {
    yield put(votingManagerActions.fetchLoadProposals.failure({ error }));
  }
}


function* saveVote(data) {
  yield put(votingManagerActions.postSaveVote.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));

    const results = yield call(votingManagerService.vote, web3, data.voteData);

    // delay to allow changes to be committed to local node
    yield delay(1000);

    yield put(votingManagerActions.postSaveVote.success({
      results,
      crowdOwnedAddress: data.voteData.crowdOwnedAddress
    }));

    console.log("saveVote TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'vote saved',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(votingManagerActions.postSaveVote.failure({ error }));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to save vote',
        message: error.message,
        position: 'br'
      }
    }));
  }
}

function* watchSaveNewProposal() {
  yield takeEvery(votingManagerActions.SAVE_NEW_PROPOSAL, saveNewProposal);
}

function* watchPostSaveNewProposalSuccess() {
  yield takeEvery(votingManagerActions.POST_SAVE_NEW_PROPOSAL.SUCCESS, loadProposals);
}

function* watchSaveVote() {
  yield takeEvery(votingManagerActions.SAVE_VOTE, saveVote);
}

function* watchPostSaveVoteSuccess() {
  yield takeEvery(votingManagerActions.POST_SAVE_VOTE.SUCCESS, loadProposals);
}

function* watchLoadProposals() {
  yield takeEvery(votingManagerActions.LOAD_PROPOSALS, loadProposals);
}

export default function* votingManagerSaga() {
  yield all([
    watchSaveNewProposal(),
    watchPostSaveNewProposalSuccess(),
    watchSaveVote(),
    watchPostSaveVoteSuccess(),
    watchLoadProposals(),
  ]);
}