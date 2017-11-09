import React, {Component} from 'react'

const _ = require('lodash');

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

  sortCrowdOwnedContracts(crowdOwnedContracts) {
    return _.orderBy(crowdOwnedContracts, ['balance', 'name'], ['desc', 'asc']);
  }

  render() {
    if (!this.props.web3Store.get("web3")) {
      return null;
    }

    let {registryStore, crowdOwnedStore} = this.props;

    let crowdOwnedContracts = crowdOwnedStore.get('crowdOwnedContracts');

    return (
      <div className="container">
        <div className="home">
          {registryStore.get('loadingUsersData') ?
            "Loading Users Data..."
            :
            <div className="row">
              <div className="col-sm-6">
                <h1>CRWD</h1>

                {registryStore.get('currentUserData').isUserData ?
                  <div>
                    <h2>My Application Status</h2>

                    <UserData userData={registryStore.get('currentUserData')}/>

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
                <h3>Crowd Owned objects</h3>

                {crowdOwnedStore.get('loadingCrowdOwnedContracts') ?
                  "Loading CrowdOwned Contracts..."
                  :
                  <div className="crowd-owned-contracts listing-block">
                    {crowdOwnedContracts.length === 0 ? <em>The CrowdOwned Contracts list is empty.</em> : null}
                    {this.sortCrowdOwnedContracts(crowdOwnedContracts).map((crowdOwnedContract) => (
                      <CrowdOwnedContract crowdOwnedContract={crowdOwnedContract} key={crowdOwnedContract.address}/>
                    ))}
                  </div>
                }
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