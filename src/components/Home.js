import React, {Component} from 'react'

const _ = require('lodash');

import userDataHelpers from '../utils/userDataHelpers';

import * as registryActions from '../actions/registryActions';
import * as notificationActions from '../actions/notificationActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import NewAddressForm from './NewAddressForm';
import UserData from './UserData';
import CrowdOwnedContract from './CrowdOwnedContract';


class Home extends Component {
  componentDidMount() {
  }

  filterCrowdOwnedContracts(crowdOwnedContracts) {
    let state = this.props.registryStore.get('currentUserData').state;
    let stateText = userDataHelpers.getEntryStateText(state);

    return _.filter(crowdOwnedContracts, (crowdOwnedContract) => {
      return stateText === "VERIFIED" || crowdOwnedContract.balance > 0;
    });
  }

  sortCrowdOwnedContracts(crowdOwnedContracts) {
    return _.orderBy(crowdOwnedContracts, ['balance', 'name'], ['desc', 'asc']);
  }

  render() {
    if (!this.props.web3Store.get("web3")) {
      return null;
    }

    let {registryStore, crowdOwnedStore, web3Store} = this.props;
    let currentUserData = registryStore.get('currentUserData');
    let crowdOwnedContracts = this.filterCrowdOwnedContracts(this.sortCrowdOwnedContracts(crowdOwnedStore.get('crowdOwnedContracts')));
    let ownAddress = web3Store.get("web3").eth.defaultAccount;
    let registryOwnerAddress = registryStore.get('ownerAddress');

    return (
      <div className="container">
        <div className="home">
          {registryStore.get('loadingUsersData') ?
            "Loading Users Data..."
            :
            <div className="row">
              <div className="col-sm-6">

                {currentUserData.isUserData ?
                  <div>
                    <h2>My Application Status</h2>

                    <UserData userData={currentUserData}/>

                  </div>
                  :
                  <div>
                    <h2>Register your address</h2>
                    <p>A notary service will verify your information.</p>
                    <NewAddressForm/>
                  </div>
                }
              </div>

              <div className="col-sm-6">
                {(registryOwnerAddress === ownAddress || userDataHelpers.getEntryStateText(currentUserData.state) !== "NEW") ?
                  <div>
                    <h3>Crowd Owned objects ({crowdOwnedContracts.length})</h3>

                    {crowdOwnedStore.get('loadingCrowdOwnedContracts') ?
                      "Loading CrowdOwned Contracts..."
                      :
                      <div className="crowd-owned-contracts listing-block">
                        {crowdOwnedContracts.length === 0 ? <em>The CrowdOwned Contracts list is empty.</em> : null}
                        {crowdOwnedContracts.map((crowdOwnedContract) => (
                          <CrowdOwnedContract crowdOwnedContract={crowdOwnedContract} key={crowdOwnedContract.address}/>
                        ))}
                      </div>
                    }
                  </div>
                  : null}
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
    crowdOwnedStore: state.crowdOwnedStore,
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
)(Home);