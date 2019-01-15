import React, {Component} from 'react'

import * as crowdOwnedExchangeActions from '../actions/crowdOwnedExchangeActions';
import orderDataHelpers from '../utils/orderDataHelpers';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

class NewOrderForm extends Component {

  componentDidMount() {
  }

  updateInputValue(value, field) {
    let newOrder = Object.assign({}, this.props.crowdOwnedExchangeStore.get("newOrder"));
    newOrder[field] = value;
    this.props.crowdOwnedExchangeActions.setNewOrder({newOrder});
  }

  formValid() {
    let amount = parseFloat(this.props.crowdOwnedExchangeStore.get("newOrder").amount);
    let price = parseFloat(this.props.crowdOwnedExchangeStore.get("newOrder").price);
    let orderType = parseFloat(this.props.crowdOwnedExchangeStore.get("newOrder").orderType);
    return amount > 0 && price > 0 && orderDataHelpers.getOrderTypeText(orderType);
  }

  onSubmit(e) {
    e.preventDefault();

    this.updateInputValue(this.props.crowdOwnedAddress, "tokenAddress");
    this.props.crowdOwnedExchangeActions.saveNewOrder();
  }

  render() {
    let {crowdOwnedExchangeStore} = this.props;
    let newOrder = crowdOwnedExchangeStore.get('newOrder');

    return (
      <form className="new-order-form form-horizontal" onSubmit={(e) => this.onSubmit(e)}>
        <div className="form-group row">
          <label className="control-label col-sm-3">Order Type:</label>
          <div className="col-sm-5">
            <select value={newOrder.orderType}
                    onChange={(e) => this.updateInputValue(parseInt(e.target.value, 10), 'orderType')}>
              <option value={orderDataHelpers.getOrderTypeInt("BUY")}>BUY</option>
              <option value={orderDataHelpers.getOrderTypeInt("SELL")}>SELL</option>
            </select>
          </div>
        </div>
        <div className="form-group row">
          <label className="control-label col-sm-3">Price:</label>
          <div className="col-sm-5">
            <input type="text" name="price" placeholder="5" className="form-control"
                   value={newOrder.price}
                   onChange={(e) => this.updateInputValue(e.target.value, 'price')}/>
          </div>
        </div>
        <div className="form-group row">
          <label className="control-label col-sm-3">Amount:</label>
          <div className="col-sm-5">
            <input type="text" name="amount" placeholder="100" className="form-control"
                   value={newOrder.amount}
                   onChange={(e) => this.updateInputValue(e.target.value, 'amount')}/>
          </div>
        </div>

        <div className="form-group row">
          <div className="col-sm-5">
            <button className="btn btn-info" type="submit"
                    disabled={!this.formValid() || crowdOwnedExchangeStore.get("savingNewOrder")}>
              Submit
            </button>
          </div>
        </div>

        {crowdOwnedExchangeStore.get("savingNewOrder") ? <em>Saving ...</em> : null}
      </form>
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
)(NewOrderForm);