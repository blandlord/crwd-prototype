import {Map as ImmutableMap} from 'immutable';


let initialData = {
  newUserData: {
    ssn: '',
  },
  usersData: [],
  currentUserData:{
    
  }
};

export default function registryReducer(state = new ImmutableMap(initialData), action) {

  const setNewUserData = (state) => {
    return state
      .set('newUserData', action.newUserData);
  };

  const postSaveNewUserDataRequest = (state) => {
    return state
      .set('savingNewUserData', true);
  };

  const postSaveNewUserDataSuccess = (state) => {
    return state
      .set('savingNewUserData', false)
      .set('newUserData', initialData.newUserData);
  };

  const postSaveNewUserDataFailure = (state) => {
    return state
      .set('savingNewUserData', false);
  };

  const fetchLoadUsersDataRequest = (state) => {
    return state
      .set('loadingUsersData', true);
  };

  const fetchLoadUsersDataSuccess = (state) => {
    return state
      .set('loadingUsersData', false)
      .set('usersData', action.usersData)
      .set('currentUserData', action.currentUserData);
  };

  const fetchLoadUsersDataFailure = (state) => {
    return state
      .set('loadingUsersData', false);
  };
  
  
  

  const postSetStateRequest = (state) => {
    return state
      .set('settingState', true);
  };

  const postSetStateSuccess = (state) => {
    return state
      .set('settingState', false);
  };

  const postSetStateFailure = (state) => {
    return state
      .set('settingState', false);
  };


  
  const fetchLoadOwnerAddressRequest = (state) => {
    return state
      .set('loadingOwnerAddress', true);
  };

  const fetchLoadOwnerAddressSuccess = (state) => {
    return state
      .set('loadingOwnerAddress', false)
      .set('ownerAddress', action.ownerAddress);
  };

  const fetchLoadOwnerAddressFailure = (state) => {
    return state
      .set('loadingOwnerAddress', false);
  };
  
  
  
  const actions = {
    'SET_NEW_USER_DATA': () => setNewUserData(state),
    'POST_SAVE_NEW_USER_DATA_REQUEST': () => postSaveNewUserDataRequest(state),
    'POST_SAVE_NEW_USER_DATA_SUCCESS': () => postSaveNewUserDataSuccess(state),
    'POST_SAVE_NEW_USER_DATA_FAILURE': () => postSaveNewUserDataFailure(state),
    'FETCH_LOAD_USERS_DATA_REQUEST': () => fetchLoadUsersDataRequest(state),
    'FETCH_LOAD_USERS_DATA_SUCCESS': () => fetchLoadUsersDataSuccess(state),
    'FETCH_LOAD_USERS_DATA_FAILURE': () => fetchLoadUsersDataFailure(state),
    'POST_SET_STATE_REQUEST': () => postSetStateRequest(state),
    'POST_SET_STATE_SUCCESS': () => postSetStateSuccess(state),
    'POST_SET_STATE_FAILURE': () => postSetStateFailure(state),
    'FETCH_LOAD_OWNER_ADDRESS_REQUEST': () => fetchLoadOwnerAddressRequest(state),
    'FETCH_LOAD_OWNER_ADDRESS_SUCCESS': () => fetchLoadOwnerAddressSuccess(state),
    'FETCH_LOAD_OWNER_ADDRESS_FAILURE': () => fetchLoadOwnerAddressFailure(state),
    'DEFAULT': () => state
  };

  return ((action && actions[action.type]) ? actions[action.type] : actions['DEFAULT'])()
}