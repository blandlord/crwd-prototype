import React, {Component} from 'react'

const _ = require('lodash');

import * as crowdOwnedActions from '../actions/crowdOwnedActions';
import * as notificationActions from '../actions/notificationActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import TokensTransferForm from './TokensTransferForm';


class CrowdOwnedDetails extends Component {
  componentDidMount() {
    if (this.props.web3Store.get("web3")) {
      this.loadCrowdOwnedContract();
    }
    else {
      // wait a second for web3 to load
      setTimeout(this.loadCrowdOwnedContract.bind(this), 1000);
    }
  }

  loadCrowdOwnedContract() {
    let address = this.props.match.params.address;
    this.props.crowdOwnedActions.loadCrowdOwnedContract({contractAddress: address});
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
              <div>
                <div className="row">
                  <div className="col-sm-6">
                    <h1>Crowd Owned Contract</h1>
                    <div>Name: {crowdOwnedContract.name}</div>
                    <div>Symbol: {crowdOwnedContract.symbol}</div>
                    <div>Address: {crowdOwnedContract.address}</div>
                    <div>Your Balance: {crowdOwnedContract.balance}</div>
                    <div>Contract Balance: {crowdOwnedContract.contractBalance}</div>
                    {crowdOwnedContract.imageUrl ?
                      <div>
                        <img className="img-responsive" src={crowdOwnedContract.imageUrl} role="presentation"/>
                      </div>
                      : null}
                  </div>
                </div>

                <h3>Transfer Tokens</h3>
                <TokensTransferForm contractAddress={this.props.match.params.address}/>
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