import React, {Component} from 'react'
import {NavLink} from "react-router-dom";

const _ = require('lodash');
import moment from 'moment';

import * as crowdOwnedActions from '../actions/crowdOwnedActions';
import * as crowdOwnedExchangeActions from '../actions/crowdOwnedExchangeActions';
import * as votingManagerActions from '../actions/votingManagerActions';
import * as notificationActions from '../actions/notificationActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import TokensTransferForm from './TokensTransferForm';
import SaveValuationForm from './SaveValuationForm';
import OrderBook from './OrderBook';
import NewProposalForm from './NewProposalForm';
import ProposalsList from './ProposalsList';


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
    this.props.crowdOwnedActions.loadCrowdOwnedContract({ contractAddress: address });

    // load exchange orders
    this.props.crowdOwnedExchangeActions.loadOrders({ crowdOwnedAddress: address });

    // load proposals
    this.props.votingManagerActions.loadProposals({ crowdOwnedAddress: address });
  }

  sortOwnersData(ownersData) {
    return _.orderBy(ownersData, ['balance'], ['desc']);
  }

  killCrowdOwnedContract(contractAddress) {
    this.props.crowdOwnedActions.killCrowdOwnedContract({ contractAddress: contractAddress });
  }

  render() {
    if (!this.props.web3Store.get("web3")) {
      return null;
    }

    let { crowdOwnedStore, crowdOwnedExchangeStore, votingManagerStore, web3Store } = this.props;

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
                        ` ${crowdOwnedContract.lastValuation.currency} ${crowdOwnedContract.lastValuation.value} (${moment(crowdOwnedContract.lastValuation.date).format("YYYY-MM-DD")}) (Block #${crowdOwnedContract.lastValuation.blockheight})`
                        : 'N/A'}
                    </div>
                    <div>
                      Valuation per Token: € {crowdOwnedContract.contractValuationPerToken}
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
                      <span className="balance">{crowdOwnedContract.contractEthBalance}</span>&nbsp;
                      <span className="euro">
                        (€ {crowdOwnedContract.contractEthEurValue})
                      </span>
                    </div>
                  </div>
                  <div className="col-xs-8 col-sm-4 col-lg-3">
                    {crowdOwnedContract.imageUrl ?
                      <div>
                        <img className="img-responsive" src={crowdOwnedContract.imageUrl} role="presentation"/>
                      </div>
                      :
                      null
                    }
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <h3>incoming ETH transactions</h3>
                    {crowdOwnedContract.incomingEthPayments.map((incomingEthPayment) => (
                      <div className="row" key={incomingEthPayment.tx}>
                        <div
                          className="col-xs-12 col-sm-3 date">{moment(incomingEthPayment.date).format("YYYY-MM-DD")}</div>
                        <div className="col-xs-4 col-sm-3 date">Block #{incomingEthPayment.blockheight}</div>
                        <div className="col-xs-4 col-sm-3 amount">ETH {incomingEthPayment.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="col-sm-6">
                    <h3>Transfer Tokens</h3>

                    <NavLink exact to={"/crowd-owned-exchange/" + crowdOwnedContract.address}>Exchange</NavLink>

                    <div>Your balance:
                      <span className="balance">{crowdOwnedContract.balance}</span>&nbsp;
                      {crowdOwnedContract.symbol}
                    </div>
                    <TokensTransferForm contractAddress={crowdOwnedContract.address}/>

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

                    <h3>Exchange Orderbook</h3>

                    {crowdOwnedExchangeStore.get('loadingOrders') ?
                      "Loading Orders ..."
                      :
                      <OrderBook crowdOwnedAddress={crowdOwnedContract.address} isSummary={true}/>
                    }

                  </div>
                </div>

                {crowdOwnedContract.ownerAddress === ownAddress ?
                  <div className="row">
                    <div className="col-md-6">
                      <h3>Save Valuation</h3>
                      <SaveValuationForm contractAddress={crowdOwnedContract.address}/>
                    </div>
                  </div>
                  :
                  null
                }

                <div className="row">
                  <div className="col-md-6">
                    <h3>New Proposal</h3>
                    <NewProposalForm crowdOwnedAddress={crowdOwnedContract.address}/>
                  </div>
                  <div className="col-md-6">
                    <h3>Proposals</h3>
                    {votingManagerStore.get('loadingProposals') ?
                      "Loading Proposals ..."
                      :
                      <ProposalsList crowdOwnedAddress={crowdOwnedContract.address}
                                     proposals={votingManagerStore.get('proposals')}/>
                    }
                  </div>
                </div>

                {crowdOwnedContract.ownerAddress === ownAddress ?
                  <div className="well">
                    You are the owner of this contract and have the power to stop the project. &nbsp;
                    <span>
                      <button className="btn btn-danger" type="button"
                              onClick={() => this.killCrowdOwnedContract(crowdOwnedContract.address)}
                              disabled={crowdOwnedStore.get("killingCrowdOwnedContract")}>
                      Kill Contract
                     </button>
                    </span>
                  </div>
                  : null
                }
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
    crowdOwnedExchangeStore: state.crowdOwnedExchangeStore,
    votingManagerStore: state.votingManagerStore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    crowdOwnedActions: bindActionCreators(crowdOwnedActions, dispatch),
    crowdOwnedExchangeActions: bindActionCreators(crowdOwnedExchangeActions, dispatch),
    votingManagerActions: bindActionCreators(votingManagerActions, dispatch),
    notificationActions: bindActionCreators(notificationActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CrowdOwnedDetails);