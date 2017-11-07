import React, {Component} from 'react'

const _ = require('lodash');

import * as crowdOwnedActions from '../actions/crowdOwnedActions';
import * as notificationActions from '../actions/notificationActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'


class CrowdOwnedDetails extends Component {
  componentDidMount() {
    let address = this.props.match.params.address;
    this.props.crowdOwnedActions.loadCrowdOwnedContract({address});
  }

  render() {
    if (!this.props.web3Store.get("web3")) {
      return null;
    }

    let {crowdOwnedStore} = this.props;

    let crowdOwnedContract = crowdOwnedStore.get('crowdOwnedContract');

    return (
      <div className="container">
        <div className="crowd-owned-details">
          {crowdOwnedStore.get('loadingCrowdOwnedContract') ?
            "Loading Crowd Owned Contract ..."
            :
            crowdOwnedStore.get('crowdOwnedContract') ?
              <div className="row">
                <div className="col-sm-6">
                  <h1>Crowd Owned Contract</h1>
                  <div>Name: {crowdOwnedContract.name}</div>
                  <div>Symbol: {crowdOwnedContract.symbol}</div>
                  <div>Address: {crowdOwnedContract.address}</div>
                  <div>Your Balance: {crowdOwnedContract.balance}</div>
                </div>
              </div>
              :
              null
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
    crowdOwnedActions: bindActionCreators(crowdOwnedActions, dispatch),
    notificationActions: bindActionCreators(notificationActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CrowdOwnedDetails);