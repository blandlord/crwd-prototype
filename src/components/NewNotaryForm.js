import React, {Component} from 'react'

import _ from 'lodash';

import * as registryActions from '../actions/registryActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'


class NewNotaryForm extends Component {

  formValid() {
    let newNotaryData = this.props.registryStore.get("newNotaryData");
    return _.trim(newNotaryData.address) && _.trim(newNotaryData.name) && _.trim(newNotaryData.websiteUrl);
  }

  updateInputValue(e, field) {
    let newNotaryData = Object.assign({}, this.props.registryStore.get("newNotaryData"));
    newNotaryData[field] = e.target.value;
    this.props.registryActions.setNewNotaryData({newNotaryData});
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.registryActions.saveNewNotaryData();
  }

  render() {
    let {registryStore} = this.props;

    return (
      <form className="new-notary-form" onSubmit={(e) => this.onSubmit(e)}>
        <div className="row">
          <div className="form-group col-md-8">
            <label>Address:</label>
            <input type="text" name="address" placeholder="0x0123456789..." className="form-control"
                   value={registryStore.get("newNotaryData").address}
                   onChange={(e) => this.updateInputValue(e, 'address')}/>
          </div>
        </div>

        <div className="row">
          <div className="form-group col-md-8">
            <label>Name:</label>
            <input type="text" name="name" placeholder="Notary Name" className="form-control"
                   value={registryStore.get("newNotaryData").name}
                   onChange={(e) => this.updateInputValue(e, 'name')}/>
          </div>
        </div>

        <div className="row">
          <div className="form-group col-md-8">
            <label>Website Url:</label>
            <input type="text" name="websiteUrl" placeholder="http://example.com" className="form-control"
                   value={registryStore.get("newNotaryData").websiteUrl}
                   onChange={(e) => this.updateInputValue(e, 'websiteUrl')}/>
          </div>
        </div>

        <button className="btn btn-info" type="submit"
                disabled={!this.formValid() || registryStore.get("savingNewNotaryData")}>
          Submit
        </button>

        {registryStore.get("savingNewNotaryData") ? <em>Saving ...</em> : null}
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
)(NewNotaryForm);