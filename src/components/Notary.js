import React, {Component} from 'react'

import * as registryActions from '../actions/registryActions';
import * as notificationActions from '../actions/notificationActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import NotaryUserData from './NotaryUserData';
import NewCrowdOwnedContractForm from './NewCrowdOwnedContractForm';

class Notary extends Component {
  componentDidMount() {
    let interval = setInterval(() => {
      if (this.props.web3Store.get("web3")) {
        clearInterval(interval);
        this.loadInitialData();
      }
    }, 500);
  }

  componentWillUnmount() {
    this.props.registryActions.stopNotaryLogWatch({});
  }

  loadInitialData() {
    this.startLogWatch();
  }

  startLogWatch() {
    this.props.registryActions.startNotaryLogWatch({});
  }
  
  render() {
    let {registryStore, web3Store} = this.props;

    if (!web3Store.get("web3")) {
      return null;
    }

    let currentUserData = registryStore.get('currentUserData');

    return (
      <div className="container">
        <div className="home">
          {registryStore.get('loadingUsersData') || registryStore.get('loadingOwnerAddress') ?
            "Loading permissions ..."
            :
            !currentUserData.isNotary ?
              "Not Authorized ..."
              :
              <div className="row">
                <div className="col-sm-7">
                  <h1>CRWD Notary</h1>
                  <h3>Users Data</h3>
                  {registryStore.get('settingState') ?
                    "Setting State..."
                    :
                    null
                  }
                  {registryStore.get('loadingUsersData') ?
                    "Loading Users Data..."
                    :
                    <ul className="entries list-group">
                      {registryStore.get('usersData').length === 0 ? <em>The registry is empty.</em> : null}
                      {registryStore.get('usersData').map((userData) => (
                        <NotaryUserData userData={userData} key={userData.userAddress}/>
                      ))}
                    </ul>
                  }
                </div>
                <div className="col-sm-5">
                  <h3>Deploy CrowdOwned Contract</h3>
                  <NewCrowdOwnedContractForm/>
                </div>
              </div>
          }
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    web3Store: state.web3Store,
    registryStore: state.registryStore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    registryActions: bindActionCreators(registryActions, dispatch),
    notificationActions: bindActionCreators(notificationActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Notary);