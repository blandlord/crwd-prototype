import React, {Component} from 'react'

const _ = require('lodash');
import moment from 'moment';

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

  sortOwnersData(ownersData) {
    return _.orderBy(ownersData, ['balance'], ['desc']);
  }

  killCrowdOwnedContract(contractAddress) {
    this.props.crowdOwnedActions.killCrowdOwnedContract({contractAddress: contractAddress});
  }

  render() {
    if (!this.props.web3Store.get("web3")) {
      return null;
    }

    let {crowdOwnedStore, web3Store} = this.props;

    let crowdOwnedContract = crowdOwnedStore.get('crowdOwnedContract');
    let ownAddress = web3Store.get("web3").eth.defaultAccount;

    return (
      <div className="container">
        <div className="crowd-owned-details">
          {crowdOwnedStore.get('loadingCrowdOwnedContract') ?
            "Loading Crowd Owned Contract ..."
            :
            crowdOwnedStore.get('crowdOwnedContract') ?
              <div>
                <div className="row">
                  <div className="col-sm-8 col-lg-9">
                    <h1>{crowdOwnedContract.name}</h1>
                    <div>Symbol: {crowdOwnedContract.symbol}</div>
                    <div>Address: {crowdOwnedContract.address}</div>
                    <div>Total supply: {crowdOwnedContract.totalSupply}</div>
                    <div>In circulation: {crowdOwnedContract.circulatingSupply}</div>
                    <div>
                      Latest valuation:
                      {crowdOwnedContract.lastValuation.isValuation ?
                        ` ${crowdOwnedContract.lastValuation.currency} ${crowdOwnedContract.lastValuation.value} (${moment(crowdOwnedContract.lastValuation.date).format("YYYY-MM-DD")})`
                        : 'N/A'}
                    </div>

                    <div>Contract Balances:</div>
                    <div>
                      <span className="label label-success">{crowdOwnedContract.symbol}</span>
                      <span className="balance">{crowdOwnedContract.contractBalance}</span>
                    </div>
                    <div>
                      <span className="label label-primary">CRWD</span>
                      <span className="balance">{crowdOwnedContract.contractCRWDBalance}</span>
                    </div>
                    <div>
                      <span className="label label-default">ETH</span>
                      <span className="balance">{crowdOwnedContract.contractEthBalance}</span>
                    </div>
                  </div>
                  <div className="col-sm-4 col-lg-3">
                    {crowdOwnedContract.imageUrl ?
                      <div>
                        <img className="img-responsive" src={crowdOwnedContract.imageUrl} role="presentation"/>
                      </div>
                      : null}
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <h3>Transfer Tokens</h3>
                    <div>Your balance:
                      <span className="balance">{crowdOwnedContract.balance}</span>&nbsp;
                      {crowdOwnedContract.symbol}
                    </div>
                    <TokensTransferForm contractAddress={crowdOwnedContract.address}/>

                    {crowdOwnedContract.ownerAddress === ownAddress ?
                      <div>
                        <button className="btn btn-danger" type="button"
                                onClick={() => this.killCrowdOwnedContract(crowdOwnedContract.address)}
                                disabled={crowdOwnedStore.get("killingCrowdOwnedContract")}>
                          Kill Contract
                        </button>
                      </div>
                      : null}
                  </div>
                  <div className="col-sm-6">
                    <h3>Current owners</h3>
                    <ul>
                      {this.sortOwnersData(crowdOwnedContract.ownersData).map((ownerData) => (
                        <li key={ownerData.address}>
                          {ownerData.address === ownAddress ? <strong>{ownerData.address} </strong> :
                            <span>{ownerData.address} </span>}
                          ({ownerData.balance} tokens, {100 * ownerData.balance / 100000} %)
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
              :
              null}
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