import React, {Component} from 'react'

const _  = require('lodash');

import * as crowdOwnedActions from '../actions/crowdOwnedActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'


class NewCrowdOwnedContractFrom extends Component {

  formValid() {
    let newCrowdOwnedContract = this.props.crowdOwnedStore.get("newCrowdOwnedContract");
    return _.trim(newCrowdOwnedContract.name) && _.trim(newCrowdOwnedContract.symbol);
  }

  updateInputValue(e, field) {
    let newCrowdOwnedContract = Object.assign({}, this.props.crowdOwnedStore.get("newCrowdOwnedContract"));
    newCrowdOwnedContract[field] = e.target.value;
    this.props.crowdOwnedActions.setNewCrowdOwnedContract({newCrowdOwnedContract});
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.crowdOwnedActions.saveNewCrowdOwnedContract();
  }

  render() {
    let {crowdOwnedStore} = this.props;

    return (
      <form className="new-crowd-owned-form" onSubmit={(e) => this.onSubmit(e)}>
        <div className="row">
          <div className="form-group col-md-8">
            <label>Name:</label>
            <input type="text" name="name" placeholder="Token A" className="form-control"
                   value={crowdOwnedStore.get("newCrowdOwnedContract").name}
                   onChange={(e) => this.updateInputValue(e, 'name')}/>
          </div>
        </div>

        <div className="row">
          <div className="form-group col-md-6">
            <label>Symbol:</label>
            <input type="text" name="symbol" placeholder="TOK" className="form-control"
                   value={crowdOwnedStore.get("newCrowdOwnedContract").symbol}
                   onChange={(e) => this.updateInputValue(e, 'symbol')}/>
          </div>
        </div>

        <button className="btn btn-info" type="submit"
                disabled={!this.formValid() || crowdOwnedStore.get("savingNewCrowdOwnedContract")}>
          Submit
        </button>

        {crowdOwnedStore.get("savingNewCrowdOwnedContract") ? <em>Saving ...</em> : null}
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
)(NewCrowdOwnedContractFrom);