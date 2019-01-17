import React, {Component} from 'react'

import * as crowdOwnedExchangeActions from '../actions/crowdOwnedExchangeActions';
import * as web3Actions from '../actions/web3Actions';
import * as notificationActions from '../actions/notificationActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import Order from './Order';
import orderDataHelpers from '../utils/orderDataHelpers';

class OrderBook extends Component {
  componentDidMount() {

  }

  getBuyOrders(orders) {
    return orders.filter((order) => orderDataHelpers.getOrderTypeText(order.orderType) === "BUY").sort((a, b) => b.price.cmp(a.price));
  }

  getSellOrders(orders) {
    return orders.filter((order) => orderDataHelpers.getOrderTypeText(order.orderType) === "SELL").sort((a, b) => a.price.cmp(b.price));
  }

  render() {
    let { crowdOwnedExchangeStore, isSummary } = this.props;

    let orders = crowdOwnedExchangeStore.get('orders');
    let crowdOwnedAddress = this.props.crowdOwnedAddress;

    return (
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
                {isSummary ?
                  null
                  :
                  <th></th>
                }
              </tr>
              </thead>
              <tbody>
              {orders ? this.getBuyOrders(orders).map((order) => <Order key={order.id} order={order}
                                                                        isSummary={isSummary}
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
                {isSummary ?
                  null
                  :
                  <th></th>
                }
              </tr>
              </thead>
              <tbody>
              {orders ? this.getSellOrders(orders).map((order) => <Order key={order.id} order={order}
                                                                         isSummary={isSummary}
                                                                         crowdOwnedAddress={crowdOwnedAddress}/>) : null}
              </tbody>
            </table>
          </div>
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
    web3Actions: bindActionCreators(web3Actions, dispatch),
    notificationActions: bindActionCreators(notificationActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrderBook);