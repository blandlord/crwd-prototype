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
      <form className="token-transfer-form form-horizontal" onSubmit={(e) => this.onSubmit(e)}>
        <div className="form-group row">
          <label className="control-label col-sm-3">Amount:</label>
          <div className="col-sm-5">
            <input type="text" name="amount" placeholder="0" className="form-control"
                   value={crowdOwnedStore.get("newTokensTransfer").amount}
                   onChange={(e) => this.updateInputValue(e.target.value, 'amount')}/>
          </div>
        </div>
        <div className="form-group row">
          <label className="control-label col-sm-3">To:</label>
          <div className="col-sm-9">
            <input type="text" name="to" placeholder="Address: 0x001122334455" className="form-control"
                   value={crowdOwnedStore.get("newTokensTransfer").to}
                   onChange={(e) => this.updateInputValue(e.target.value, 'to')}/>
          </div>
        </div>

        <div className="form-group row">
          <button className="btn btn-info pull-right" type="submit"
                  disabled={!this.formValid() || crowdOwnedStore.get("savingNewTokensTransfer")}>
            Submit
          </button>
        </div>

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