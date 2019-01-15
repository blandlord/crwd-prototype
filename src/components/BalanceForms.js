import React, {Component} from 'react'

import * as crowdOwnedExchangeActions from '../actions/crowdOwnedExchangeActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'


class BalanceForms extends Component {

  componentDidMount() {
  }

  updateNewCrwdDepositValue(e) {
    this.props.crowdOwnedExchangeActions.setNewCrwdDepositValue({newCrwdDepositValue: e.target.value});
  }

  isValidNewCrwdDeposit() {
    let newCrwdDepositValue = parseFloat(this.props.crowdOwnedExchangeStore.get("newCrwdDepositValue"));
    return newCrwdDepositValue > 0;
  }

  saveNewCrwdDeposit() {
    this.props.crowdOwnedExchangeActions.saveNewCrwdDeposit();
  }

  updateNewCrwdWithdrawalValue(e) {
    this.props.crowdOwnedExchangeActions.setNewCrwdWithdrawalValue({newCrwdWithdrawalValue: e.target.value});
  }

  isValidNewCrwdWithdrawal() {
    let newCrwdWithdrawalValue = parseFloat(this.props.crowdOwnedExchangeStore.get("newCrwdWithdrawalValue"));
    return newCrwdWithdrawalValue > 0;
  }

  saveNewCrwdWithdrawal() {
    this.props.crowdOwnedExchangeActions.saveNewCrwdWithdrawal();
  }

  updateNewTokenDepositValue(e) {
    this.props.crowdOwnedExchangeActions.setNewTokenDepositValue({newTokenDepositValue: e.target.value});
  }

  isValidNewTokenDeposit() {
    let newTokenDepositValue = parseFloat(this.props.crowdOwnedExchangeStore.get("newTokenDepositValue"));
    return newTokenDepositValue > 0;
  }

  saveNewTokenDeposit() {
    this.props.crowdOwnedExchangeActions.saveNewTokenDeposit({crowdOwnedAddress: this.props.crowdOwnedAddress});
  }

  updateNewTokenWithdrawalValue(e) {
    this.props.crowdOwnedExchangeActions.setNewTokenWithdrawalValue({newTokenWithdrawalValue: e.target.value});
  }

  isValidNewTokenWithdrawal() {
    let newTokenWithdrawalValue = parseFloat(this.props.crowdOwnedExchangeStore.get("newTokenWithdrawalValue"));
    return newTokenWithdrawalValue > 0;
  }

  saveNewTokenWithdrawal() {
    this.props.crowdOwnedExchangeActions.saveNewTokenWithdrawal({crowdOwnedAddress: this.props.crowdOwnedAddress});
  }


  render() {
    let {crowdOwnedExchangeStore} = this.props;
    let crowdOwnedContractSummary = crowdOwnedExchangeStore.get('crowdOwnedContractSummary');

    return (
      <div className="row">
        <div className="col-sm-6">
          <div className="row">
            <div className="col-sm-7">
              <input name="crwdDeposit" type="text"
                     value={crowdOwnedExchangeStore.get("newCrwdDepositValue")}
                     onChange={(e) => this.updateNewCrwdDepositValue(e)}
                     className="form-control" placeholder="CRWD amount"/>
            </div>
            <div className="col-sm-5">
              <button type="button" className="btn btn-info" onClick={this.saveNewCrwdDeposit.bind(this)}
                      disabled={!this.isValidNewCrwdDeposit() || crowdOwnedExchangeStore.get("savingNewCrwdDeposit")}>
                Deposit CRWD
              </button>
              {crowdOwnedExchangeStore.get("savingNewCrwdDeposit") ? <em>Saving ...</em> : null}
            </div>
          </div>
          <div className="row">
            <div className="col-sm-7">
              <input name="crwdWithdrawal" type="text"
                     value={crowdOwnedExchangeStore.get("newCrwdWithdrawalValue")}
                     onChange={(e) => this.updateNewCrwdWithdrawalValue(e)}
                     className="form-control" placeholder="CRWD amount"/>
            </div>
            <div className="col-sm-5">
              <button type="button" className="btn btn-info" onClick={this.saveNewCrwdWithdrawal.bind(this)}
                      disabled={!this.isValidNewCrwdWithdrawal() || crowdOwnedExchangeStore.get("savingNewCrwdWithdrawal")}>
                Withdraw CRWD
              </button>
              {crowdOwnedExchangeStore.get("savingNewCrwdWithdrawal") ? <em>Saving ...</em> : null}
            </div>
          </div>
        </div>

        <div className="col-sm-6">
          <div className="row">
            <div className="col-sm-7">
              <input name="tokenDeposit" type="text"
                     value={crowdOwnedExchangeStore.get("newTokenDepositValue")}
                     onChange={(e) => this.updateNewTokenDepositValue(e)}
                     className="form-control" placeholder="Token amount"/>
            </div>
            <div className="col-sm-5">
              <button type="button" className="btn btn-info" onClick={this.saveNewTokenDeposit.bind(this)}
                      disabled={!this.isValidNewTokenDeposit() || crowdOwnedExchangeStore.get("savingNewTokenDeposit")}>
                Deposit {crowdOwnedContractSummary.symbol}
              </button>
              {crowdOwnedExchangeStore.get("savingNewTokenDeposit") ? <em>Saving ...</em> : null}
            </div>
          </div>
          <div className="row">
            <div className="col-sm-7">
              <input name="tokenWithdrawal" type="text"
                     value={crowdOwnedExchangeStore.get("newTokenWithdrawalValue")}
                     onChange={(e) => this.updateNewTokenWithdrawalValue(e)}
                     className="form-control" placeholder="Token amount"/>
            </div>
            <div className="col-sm-5">
              <button type="button" className="btn btn-info" onClick={this.saveNewTokenWithdrawal.bind(this)}
                      disabled={!this.isValidNewTokenWithdrawal() || crowdOwnedExchangeStore.get("savingNewTokenWithdrawal")}>
                Withdraw {crowdOwnedContractSummary.symbol}
              </button>
              {crowdOwnedExchangeStore.get("savingNewTokenWithdrawal") ? <em>Saving ...</em> : null}
            </div>
          </div>
        </div>
      </div>
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
)(BalanceForms);