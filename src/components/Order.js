import React, {Component} from 'react'

const _ = require('lodash');

import * as crowdOwnedExchangeActions from '../actions/crowdOwnedExchangeActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

class Order extends Component {

  cancelOrder(orderId) {
    this.props.crowdOwnedExchangeActions.cancelOrder({
      orderId: orderId,
      crowdOwnedAddress: this.props.crowdOwnedAddress
    });
  }

  takeOrder(order) {
    this.props.crowdOwnedExchangeActions.takeOrder({ order: order, crowdOwnedAddress: this.props.crowdOwnedAddress });
  }

  render() {
    let { order, isSummary, web3Store, crowdOwnedExchangeStore } = this.props;
    let ownAddress = web3Store.get("web3").eth.defaultAccount;

    return (
      <tr>
        <td>{order.price / Math.pow(10, 18)}</td>
        <td>{order.amount}</td>
        {isSummary ?
          null
          :
          <td>
            {order.userAddress === ownAddress ?
              <button type="button" className="btn btn-sm btn-danger"
                      onClick={() => this.cancelOrder(order.id)}
                      disabled={crowdOwnedExchangeStore.get("cancellingOrder") || crowdOwnedExchangeStore.get("takingOrder")}>
                Cancel
              </button> :
              <button type="button" className="btn btn-sm btn-info"
                      onClick={() => this.takeOrder(order)}
                      disabled={crowdOwnedExchangeStore.get("cancellingOrder") || crowdOwnedExchangeStore.get("takingOrder")}>
                Take
              </button>
            }

            {crowdOwnedExchangeStore.get("cancellingOrder") === order.id ? <em>Cancelling ...</em> : null}
            {crowdOwnedExchangeStore.get("takingOrder") === order.id ? <em>Taking ...</em> : null}
          </td>
        }
      </tr>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    web3Store: state.web3Store,
    crowdOwnedExchangeStore: state.crowdOwnedExchangeStore
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    crowdOwnedExchangeActions: bindActionCreators(crowdOwnedExchangeActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Order);