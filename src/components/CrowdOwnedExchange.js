import React, {Component} from 'react'

const _ = require('lodash');

import * as crowdOwnedExchangeActions from '../actions/crowdOwnedExchangeActions';
import * as notificationActions from '../actions/notificationActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import BalanceForms from './BalanceForms';
import NewOrderForm from './NewOrderForm';
import Order from './Order';
import orderDataHelpers from '../utils/orderDataHelpers';

class CrowdOwnedExchange extends Component {
  componentDidMount() {
    if (this.props.web3Store.get("web3")) {
      this.loadInitialData();
    }
    else {
      // wait a second for web3 to load
      setTimeout(this.loadInitialData.bind(this), 1000);
    }
  }

  loadInitialData() {
    this.loadCrowdOwnedContractSummary();
    this.loadOrders();
    this.loadBalances();
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

  getBuyOrders(orders) {
    return orders.filter((order) => orderDataHelpers.getOrderTypeText(order.orderType) === "BUY").sort((a, b) => b.price - a.price);
  }

  getSellOrders(orders) {
    return orders.filter((order) => orderDataHelpers.getOrderTypeText(order.orderType) === "SELL").sort((a, b) => a.price - b.price);
  }

  render() {
    if (!this.props.web3Store.get("web3")) {
      return null;
    }

    let {crowdOwnedExchangeStore, web3Store} = this.props;

    let crowdOwnedContractSummary = crowdOwnedExchangeStore.get('crowdOwnedContractSummary');
    let balances = crowdOwnedExchangeStore.get('balances');
    let orders = crowdOwnedExchangeStore.get('orders');
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
                        <img className="img-responsive" src={crowdOwnedContractSummary.imageUrl} role="presentation"/>
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
                          <td>{balances.walletCrwdBalance / Math.pow(10, 18)}</td>
                          <td>
                            {(balances.crwdBalance + balances.lockedCrwdBalance) / Math.pow(10, 18)}
                          </td>
                          <td>
                            {balances.crwdBalance / Math.pow(10, 18)}
                          </td>
                          <td>
                            {balances.lockedCrwdBalance / Math.pow(10, 18)}
                          </td>
                        </tr>
                        <tr>
                          <th>{crowdOwnedContractSummary.symbol}</th>
                          <td>{balances.walletTokenBalance}</td>
                          <td>
                            {balances.tokenBalance + balances.lockedTokenBalance}
                          </td>
                          <td>
                            {balances.tokenBalance}
                          </td>
                          <td>
                            {balances.lockedTokenBalance}
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
                      <div className="row">
                        <div className="col-sm-6">
                          <h4>
                            Open Buy Orders
                          </h4>

                          <div className="table-responsive">
                            <table className="table table-bordered table-hover table-striped">
                              <thead>
                              <tr>
                                <th>Price</th>
                                <th>Amount</th>
                                <th></th>
                              </tr>
                              </thead>
                              <tbody>
                              {orders ? this.getBuyOrders(orders).map((order) => <Order key={order.id} order={order}
                                                                                        crowdOwnedAddress={crowdOwnedAddress}/>) : null}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <h4>
                            Open Sell Orders
                          </h4>

                          <div className="table-responsive">
                            <table className="table table-bordered table-hover table-striped">
                              <thead>
                              <tr>
                                <th>Price</th>
                                <th>Amount</th>
                                <th></th>
                              </tr>
                              </thead>
                              <tbody>
                              {orders ? this.getSellOrders(orders).map((order) => <Order key={order.id} order={order}
                                                                                         crowdOwnedAddress={crowdOwnedAddress}/>) : null}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
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
    web3Store: state.web3Store,
    registryStore: state.registryStore,
    crowdOwnedExchangeStore: state.crowdOwnedExchangeStore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    crowdOwnedExchangeActions: bindActionCreators(crowdOwnedExchangeActions, dispatch),
    notificationActions: bindActionCreators(notificationActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CrowdOwnedExchange);