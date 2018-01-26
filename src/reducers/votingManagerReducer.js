import {Map as ImmutableMap} from 'immutable';

let initialData = {
  newProposal: {
    crowdOwnedAddress: '',
    title: '',
    description: '',
    durationInDays: 7,
  },
  proposals: []
};

export default function votingManagerReducer(state = new ImmutableMap(initialData), action) {

  const setNewProposal = (state) => {
    return state
      .set('newProposal', action.newProposal);
  };

  const postSaveNewProposalRequest = (state) => {
    return state
      .set('savingNewProposal', true);
  };

  const postSaveNewProposalSuccess = (state) => {
    return state
      .set('savingNewProposal', false)
      .set('newProposal', initialData.newProposal);
  };

  const postSaveNewProposalFailure = (state) => {
    return state
      .set('savingNewProposal', false);
  };


  const fetchLoadProposalsRequest = (state) => {
    return state
      .set('loadingProposals', true);
  };

  const fetchLoadProposalsSuccess = (state) => {
    return state
      .set('loadingProposals', false)
      .set('proposals', action.proposals);
  };

  const fetchLoadProposalsFailure = (state) => {
    return state
      .set('loadingProposals', false);
  };

  const postSaveVoteRequest = (state) => {
    return state
      .set('voting', true);
  };

  const postSaveVoteSuccess = (state) => {
    return state
      .set('voting', false);
  };

  const postSaveVoteFailure = (state) => {
    return state
      .set('voting', false);
  };

  const actions = {
    'SET_NEW_PROPOSAL': () => setNewProposal(state),
    'POST_SAVE_NEW_PROPOSAL_REQUEST': () => postSaveNewProposalRequest(state),
    'POST_SAVE_NEW_PROPOSAL_SUCCESS': () => postSaveNewProposalSuccess(state),
    'POST_SAVE_NEW_PROPOSAL_FAILURE': () => postSaveNewProposalFailure(state),
    'FETCH_LOAD_PROPOSALS_REQUEST': () => fetchLoadProposalsRequest(state),
    'FETCH_LOAD_PROPOSALS_SUCCESS': () => fetchLoadProposalsSuccess(state),
    'FETCH_LOAD_PROPOSALS_FAILURE': () => fetchLoadProposalsFailure(state),
    'POST_SAVE_VOTE_REQUEST': () => postSaveVoteRequest(state),
    'POST_SAVE_VOTE_SUCCESS': () => postSaveVoteSuccess(state),
    'POST_SAVE_VOTE_FAILURE': () => postSaveVoteFailure(state),
    'DEFAULT': () => state
  };

  return ((action && actions[action.type]) ? actions[action.type] : actions['DEFAULT'])()
}