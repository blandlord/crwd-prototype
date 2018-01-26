import React, {Component} from 'react'

const _ = require('lodash');

import * as votingManagerActions from '../actions/votingManagerActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'


class NewProposalForm extends Component {

  formValid() {
    let newProposal = this.props.votingManagerStore.get("newProposal");
    return _.trim(newProposal.title) && _.trim(newProposal.description) && parseFloat(newProposal.durationInDays) > 0;
  }

  updateInputValue(value, field) {
    let newProposal = Object.assign({}, this.props.votingManagerStore.get("newProposal"));
    newProposal[field] = value;
    this.props.votingManagerActions.setNewProposal({ newProposal });
  }

  checkInputValue(value, field) {
    if (field === 'durationInDays') {
      let newProposal = Object.assign({}, this.props.votingManagerStore.get("newProposal"));
      newProposal[field] = parseFloat(value);
      this.props.votingManagerActions.setNewProposal({ newProposal });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    this.updateInputValue(this.props.crowdOwnedAddress, "crowdOwnedAddress");
    this.props.votingManagerActions.saveNewProposal();
  }

  render() {
    let { votingManagerStore } = this.props;

    return (
      <form className="new-proposal-form" onSubmit={(e) => this.onSubmit(e)}>
        <div className="row">
          <div className="form-group col-md-8">
            <label>Title:</label>
            <input type="text" name="title" placeholder="Title" className="form-control"
                   value={votingManagerStore.get("newProposal").title}
                   onChange={(e) => this.updateInputValue(e.target.value, 'title')}/>
          </div>
        </div>

        <div className="row">
          <div className="form-group col-md-8">
            <label>Description:</label>
            <textarea name="description" placeholder="Description" className="form-control"
                   value={votingManagerStore.get("newProposal").description}
                   onChange={(e) => this.updateInputValue(e.target.value, 'description')}/>
          </div>
        </div>

        <div className="row">
          <div className="form-group col-md-8">
            <label>Duration In Days:</label>
            <input type="text" name="durationInDays" placeholder="DurationInDays" className="form-control"
                   value={votingManagerStore.get("newProposal").durationInDays}
                   onChange={(e) => this.updateInputValue(e.target.value, 'durationInDays')}
                   onBlur={(e) => this.checkInputValue(e.target.value, 'durationInDays')}/>
          </div>
        </div>

        <button className="btn btn-info" type="submit"
                disabled={!this.formValid() || votingManagerStore.get("savingNewProposal")}>
          Submit
        </button>

        {votingManagerStore.get("savingNewProposal") ? <em>Saving ...</em> : null}
      </form>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    web3Store: state.web3Store,
    votingManagerStore: state.votingManagerStore
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    votingManagerActions: bindActionCreators(votingManagerActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewProposalForm);