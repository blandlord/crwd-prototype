import {action, createRequestTypes} from '../utils/actionUtils';

export const SET_NEW_USER_DATA = 'SET_NEW_USER_DATA';
export const setNewUserData = data => action(SET_NEW_USER_DATA, data);


export const SAVE_NEW_USER_DATA = 'SAVE_NEW_USER_DATA';
export const saveNewUserData = data => action(SAVE_NEW_USER_DATA, data);

export const POST_SAVE_NEW_USER_DATA = createRequestTypes('POST_SAVE_NEW_USER_DATA');
export const postSaveNewUserData = {
  request: () => action(POST_SAVE_NEW_USER_DATA.REQUEST),
  success: (data) => action(POST_SAVE_NEW_USER_DATA.SUCCESS, data),
  failure: (error) => action(POST_SAVE_NEW_USER_DATA.FAILURE, error),
};


export const LOAD_USERS_DATA = 'LOAD_USERS_DATA';
export const loadUsersData = data => action(LOAD_USERS_DATA, data);

export const FETCH_LOAD_USERS_DATA = createRequestTypes('FETCH_LOAD_USERS_DATA');
export const fetchLoadUsersData = {
  request: () => action(FETCH_LOAD_USERS_DATA.REQUEST),
  success: (data) => action(FETCH_LOAD_USERS_DATA.SUCCESS, data),
  failure: (error) => action(FETCH_LOAD_USERS_DATA.FAILURE, error),
};


export const SET_STATE = 'SET_STATE';
export const setState = data => action(SET_STATE, data);

export const POST_SET_STATE = createRequestTypes('POST_SET_STATE');
export const postSetState = {
  request: () => action(POST_SET_STATE.REQUEST),
  success: (data) => action(POST_SET_STATE.SUCCESS, data),
  failure: (error) => action(POST_SET_STATE.FAILURE, error),
};


export const LOAD_OWNER_ADDRESS = 'LOAD_OWNER_ADDRESS';
export const loadOwnerAddress = data => action(LOAD_OWNER_ADDRESS, data);

export const FETCH_LOAD_OWNER_ADDRESS = createRequestTypes('FETCH_LOAD_OWNER_ADDRESS');
export const fetchLoadOwnerAddress = {
  request: () => action(FETCH_LOAD_OWNER_ADDRESS.REQUEST),
  success: (data) => action(FETCH_LOAD_OWNER_ADDRESS.SUCCESS, data),
  failure: (error) => action(FETCH_LOAD_OWNER_ADDRESS.FAILURE, error),
};