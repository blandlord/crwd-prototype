import React, {Component} from 'react'


import * as registryActions from '../actions/registryActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'


class NewAddressForm extends Component {

  formValid() {
    let newUserData = this.props.registryStore.get("newUserData");
    return newUserData.ssn && newUserData.ssn.trim();
  }

  updateInputValue(e, field) {
    let newUserData = Object.assign({}, this.props.registryStore.get("newUserData"));
    newUserData[field] = e.target.value;
    this.props.registryActions.setNewUserData({newUserData});
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.registryActions.saveNewUserData();
  }

  render() {
    let {registryStore,web3Store} = this.props;

    return (
      <form className="new-address-form" onSubmit={(e) => this.onSubmit(e)}>
        <div className="row">
          <div className="form-group col-md-8">
            <label>Your ethereum address:</label>
            <input type="text" name="user-address" placeholder="0x000123abc" className="form-control"
                   value={web3Store.get("web3").eth.defaultAccount}
                   disabled/>
          </div>
        </div>

        <div className="row">
          <div className="form-group col-md-6">
            <label>Your social security number:</label>
            <input type="text" name="ssn" placeholder="NL-123456789" className="form-control"
                   value={registryStore.get("newUserData").ssn}
                   onChange={(e) => this.updateInputValue(e, 'ssn')}/>
          </div>
        </div>

        <button className="btn btn-info" type="submit"
                disabled={!this.formValid() || registryStore.get("savingNewUserData")}>
          Submit
        </button>

        {registryStore.get("savingNewUserData") ? <em>Saving ...</em> : null}
      </form>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    web3Store: state.web3Store,
    registryStore: state.registryStore
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    registryActions: bindActionCreators(registryActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewAddressForm);