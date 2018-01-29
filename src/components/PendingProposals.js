import React, {Component} from 'react'

const _ = require('lodash');

import * as votingManagerActions from '../actions/votingManagerActions';
import * as web3Actions from '../actions/web3Actions';
import * as notificationActions from '../actions/notificationActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'


class PendingProposals extends Component {
  componentDidMount() {
  }

  sortProposals(pendingProposals) {
    return _.orderBy(_.flatten(_.values(pendingProposals)), ['deadline'], ['asc']);
  }

  getCrowdOwnedName(proposal) {
    let crowdOwnedContract = _.find(this.props.crowdOwnedStore.get("crowdOwnedContracts"), { address: proposal.crowdOwnedAddress });
    return _.get(crowdOwnedContract, "name");
  }

  renderProposal(proposal) {
    return (
      <div key={proposal.crowdOwnedAddress + "-" + proposal.id}>
        {
          <div>
            <p>
              "{proposal.title}" ({this.getCrowdOwnedName(proposal)})<br/>
              Voting will close on {proposal.deadlineDate.toISOString()}
            </p>
          </div>
        }
      </div>
    );
  }

  render() {
    let { pendingProposals } = this.props;

    return (
      <div>
        <h4>Pending Proposals</h4>
        <div>
          {pendingProposals ? this.sortProposals(pendingProposals).map((proposal) => this.renderProposal(proposal)) : null}
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    web3Store: state.web3Store,
    votingManagerStore: state.votingManagerStore,
    crowdOwnedStore: state.crowdOwnedStore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    votingManagerActions: bindActionCreators(votingManagerActions, dispatch),
    web3Actions: bindActionCreators(web3Actions, dispatch),
    notificationActions: bindActionCreators(notificationActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PendingProposals);