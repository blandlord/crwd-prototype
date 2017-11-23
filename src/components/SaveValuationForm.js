import React, {Component} from 'react'

const _ = require('lodash');

import * as crowdOwnedActions from '../actions/crowdOwnedActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'


class SaveValuationForm extends Component {

  componentDidMount() {
    this.updateInputValue(this.props.contractAddress, 'contractAddress');
  }

  formValid() {
    let newValuation = this.props.crowdOwnedStore.get("newValuation");
    return _.trim(newValuation.contractAddress) &&
      _.trim(newValuation.currency) &&
      parseFloat(newValuation.value) > 0 &&
      parseFloat(newValuation.blockheight) > 0;
  }

  updateInputValue(value, field) {
    let newValuation = Object.assign({}, this.props.crowdOwnedStore.get("newValuation"));
    newValuation[field] = value;
    this.props.crowdOwnedActions.setNewValuation({newValuation});
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.crowdOwnedActions.saveNewValuation();
  }

  render() {
    let {crowdOwnedStore} = this.props;

    return (
      <form className="valuation-form form-horizontal" onSubmit={(e) => this.onSubmit(e)}>
        <div className="form-group row">
          <label className="control-label col-sm-3">Blockheight:</label>
          <div className="col-sm-5">
            <input type="text" name="blockheight" placeholder="12345" className="form-control"
                   value={crowdOwnedStore.get("newValuation").blockheight}
                   onChange={(e) => this.updateInputValue(e.target.value, 'blockheight')}/>
          </div>
        </div>
        <div className="form-group row">
          <label className="control-label col-sm-3">Value: ({crowdOwnedStore.get("newValuation").currency})</label>
          <div className="col-sm-5">
            <input type="text" name="value" placeholder="450" className="form-control"
                   value={crowdOwnedStore.get("newValuation").value}
                   onChange={(e) => this.updateInputValue(e.target.value, 'value')}/>
          </div>
        </div>

        <div className="form-group row">
          <div className="col-sm-5">
            <button className="btn btn-info" type="submit"
                    disabled={!this.formValid() || crowdOwnedStore.get("savingNewValuation")}>
              Submit
            </button>
          </div>
        </div>

        {crowdOwnedStore.get("savingNewValuation") ? <em>Transferring ...</em> : null}
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
)(SaveValuationForm);