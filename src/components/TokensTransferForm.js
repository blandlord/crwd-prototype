import React, {Component} from 'react'

const _ = require('lodash');

import * as crowdOwnedActions from '../actions/crowdOwnedActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'


class TokensTransferForm extends Component {

  componentDidMount() {
    this.updateInputValue(this.props.contractAddress, 'contractAddress');
  }

  formValid() {
    let newTokensTransfer = this.props.crowdOwnedStore.get("newTokensTransfer");
    return _.trim(newTokensTransfer.contractAddress) &&
      _.trim(newTokensTransfer.to) &&
      parseFloat(newTokensTransfer.amount) > 0;
  }

  updateInputValue(value, field) {
    let newTokensTransfer = Object.assign({}, this.props.crowdOwnedStore.get("newTokensTransfer"));
    newTokensTransfer[field] = value;
    this.props.crowdOwnedActions.setNewTokensTransfer({newTokensTransfer: newTokensTransfer});
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.crowdOwnedActions.saveNewTokensTransfer();
  }

  render() {
    let {crowdOwnedStore} = this.props;

    return (
      <form className="token-transfer-form" onSubmit={(e) => this.onSubmit(e)}>
        <div className="row">
          <div className="form-group col-md-8">
            <label>To:</label>
            <input type="text" name="to" placeholder="Address: 0x0000102344123" className="form-control"
                   value={crowdOwnedStore.get("newTokensTransfer").to}
                   onChange={(e) => this.updateInputValue(e.target.value, 'to')}/>
          </div>
        </div>

        <div className="row">
          <div className="form-group col-md-6">
            <label>Amount:</label>
            <input type="text" name="amount" placeholder="TOK" className="form-control"
                   value={crowdOwnedStore.get("newTokensTransfer").amount}
                   onChange={(e) => this.updateInputValue(e.target.value, 'amount')}/>
          </div>
        </div>

        <button className="btn btn-info" type="submit"
                disabled={!this.formValid() || crowdOwnedStore.get("savingNewTokensTransfer")}>
          Submit
        </button>

        {crowdOwnedStore.get("savingNewTokensTransfer") ? <em>Transferring ...</em> : null}
      </form>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    web3Store: state.web3Store,
    crowdOwnedStore: state.crowdOwnedStore
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    crowdOwnedActions: bindActionCreators(crowdOwnedActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TokensTransferForm);