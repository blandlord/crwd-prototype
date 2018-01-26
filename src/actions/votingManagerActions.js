import {action, createRequestTypes} from '../utils/actionUtils';


export const SET_NEW_PROPOSAL = 'SET_NEW_PROPOSAL';
export const setNewProposal = data => action(SET_NEW_PROPOSAL, data);

export const SAVE_NEW_PROPOSAL = 'SAVE_NEW_PROPOSAL';
export const saveNewProposal = data => action(SAVE_NEW_PROPOSAL, data);

export const POST_SAVE_NEW_PROPOSAL = createRequestTypes('POST_SAVE_NEW_PROPOSAL');
export const postSaveNewProposal = {
  request: () => action(POST_SAVE_NEW_PROPOSAL.REQUEST),
  success: (data) => action(POST_SAVE_NEW_PROPOSAL.SUCCESS, data),
  failure: (error) => action(POST_SAVE_NEW_PROPOSAL.FAILURE, error),
};


export const LOAD_PROPOSALS = 'LOAD_PROPOSALS';
export const loadProposals = data => action(LOAD_PROPOSALS, data);

export const FETCH_LOAD_PROPOSALS = createRequestTypes('FETCH_LOAD_PROPOSALS');
export const fetchLoadProposals = {
  request: () => action(FETCH_LOAD_PROPOSALS.REQUEST),
  success: (data) => action(FETCH_LOAD_PROPOSALS.SUCCESS, data),
  failure: (error) => action(FETCH_LOAD_PROPOSALS.FAILURE, error),
};


export const SAVE_VOTE = 'SAVE_VOTE';
export const saveVote = data => action(SAVE_VOTE, data);

export const POST_SAVE_VOTE = createRequestTypes('POST_SAVE_VOTE');
export const postSaveVote = {
  request: () => action(POST_SAVE_VOTE.REQUEST),
  success: (data) => action(POST_SAVE_VOTE.SUCCESS, data),
  failure: (error) => action(POST_SAVE_VOTE.FAILURE, error),
};
