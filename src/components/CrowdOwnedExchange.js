import React, {Component} from 'react'

import * as crowdOwnedExchangeActions from '../actions/crowdOwnedExchangeActions';
import * as web3Actions from '../actions/web3Actions';
import * as notificationActions from '../actions/notificationActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import BalanceForms from './BalanceForms';
import NewOrderForm from './NewOrderForm';
import OrderBook from './OrderBook';

class CrowdOwnedExchange extends Component {
  componentDidMount() {
    let interval = setInterval(() => {
      if (this.props.web3) {
        clearInterval(interval);
        this.loadInitialData();
      }
    }, 500);
  }

  componentWillUnmount() {
    this.props.crowdOwnedExchangeActions.stopCrowdOwnedExchangeLogWatch({});
  }

  loadInitialData() {
    this.loadCrowdOwnedContractSummary();
    this.loadOrders();
    this.loadBalances();

    this.startLogWatch();
  }

  startLogWatch() {
    let address = this.props.match.params.address;
    this.props.crowdOwnedExchangeActions.startCrowdOwnedExchangeLogWatch({crowdOwnedAddress: address});
  }

  loadCrowdOwnedContractSummary() {
    let address = this.props.match.params.address;
    this.props.crowdOwnedExchangeActions.loadCrowdOwnedContractSummary({crowdOwnedAddress: address});
  }

  loadOrders() {
    let address = this.props.match.params.address;
    this.props.crowdOwnedExchangeActions.loadOrders({crowdOwnedAddress: address});
  }

  loadBalances() {
    let address = this.props.match.params.address;
    this.props.crowdOwnedExchangeActions.loadBalances({crowdOwnedAddress: address});
  }

  render() {
    let {web3} = this.props;
    if (!web3) {
      return null;
    }
    let BN = web3.utils.BN;
    
    let {crowdOwnedExchangeStore} = this.props;

    let crowdOwnedContractSummary = crowdOwnedExchangeStore.get('crowdOwnedContractSummary');
    let balances = crowdOwnedExchangeStore.get('balances');
    let crowdOwnedAddress = this.props.match.params.address;

    return (
      <div className="container">
        <div className="crowd-owned-exchange">
          {crowdOwnedExchangeStore.get('loadingCrowdOwnedContractSummary') ?
            "Loading Crowd Owned Contract ..."
            :
            crowdOwnedContractSummary ?
              <div>
                <div className="row">
                  <div className="col-sm-8 col-lg-9">
                    <h1>Exchange</h1>
                    <div>Name: {crowdOwnedContractSummary.name}</div>
                    <div>Symbol: {crowdOwnedContractSummary.symbol}</div>
                    <div>Address: {crowdOwnedContractSummary.address}</div>
                  </div>
                  <div className="col-xs-8 col-sm-4 col-lg-3">
                    {crowdOwnedContractSummary.imageUrl ?
                      <div>
                        <img className="img-responsive" src={crowdOwnedContractSummary.imageUrl}  alt={""}/>
                      </div>
                      :
                      null
                    }
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6">
                    <h3>Balances</h3>
                    {crowdOwnedExchangeStore.get('loadingBalances') ?
                      "Loading Balances ..."
                      :
                      <table className="table table-responsive table-condensed table-bordered">
                        <thead>
                        <tr>
                          <th rowSpan="2"></th>
                          <th rowSpan="2">Wallet</th>
                          <th colSpan="3">Exchange</th>
                        </tr>
                        <tr>
                          <th>Total</th>
                          <th>Available</th>
                          <th>Locked</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                          <th>CRWD</th>
                          <td>{balances.walletCrwdBalance.div(new BN(10).pow(new BN(18))).toString()}</td>
                          <td>
                            {(balances.crwdBalance.add(balances.lockedCrwdBalance)).div(new BN(10).pow(new BN(18))).toString()}
                          </td>
                          <td>
                            {balances.crwdBalance.div(new BN(10).pow(new BN(18))).toString()}
                          </td>
                          <td>
                            {balances.lockedCrwdBalance.div(new BN(10).pow(new BN(18))).toString()}
                          </td>
                        </tr>
                        <tr>
                          <th>{crowdOwnedContractSummary.symbol}</th>
                          <td>{balances.walletTokenBalance.toString()}</td>
                          <td>
                            {balances.tokenBalance.add(balances.lockedTokenBalance).toString()}
                          </td>
                          <td>
                            {balances.tokenBalance.toString()}
                          </td>
                          <td>
                            {balances.lockedTokenBalance.toString()}
                          </td>
                        </tr>
                        </tbody>
                      </table>
                    }
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-12">
                    <h3>Deposit/Withdraw</h3>
                    <BalanceForms crowdOwnedAddress={crowdOwnedAddress}/>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-12">
                    <h3>Order Book</h3>

                    {crowdOwnedExchangeStore.get('loadingOrders') ?
                      "Loading Orders ..."
                      :
                      <OrderBook crowdOwnedAddress={crowdOwnedAddress}/>
                    }

                    <div className="row">
                      <div className="col-sm-6">
                        <h4>
                          New Order
                        </h4>
                        <NewOrderForm crowdOwnedAddress={crowdOwnedAddress}/>
                      </div>
                    </div>

                  </div>
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
    web3: state.web3Store.get("web3"),
    registryStore: state.registryStore,
    crowdOwnedExchangeStore: state.crowdOwnedExchangeStore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    crowdOwnedExchangeActions: bindActionCreators(crowdOwnedExchangeActions, dispatch),
    web3Actions: bindActionCreators(web3Actions, dispatch),
    notificationActions: bindActionCreators(notificationActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CrowdOwnedExchange);