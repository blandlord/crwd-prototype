import React, {Component} from 'react'

const _ = require('lodash');

import * as votingManagerActions from '../actions/votingManagerActions';
import * as web3Actions from '../actions/web3Actions';
import * as notificationActions from '../actions/notificationActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'


class ProposalsList extends Component {
  componentDidMount() {

  }

  saveVote(proposal, choice) {
    this.props.votingManagerActions.saveVote({
      voteData: {
        crowdOwnedAddress: proposal.crowdOwnedAddress,
        proposalId: proposal.id,
        choice,
      }
    });
  }

  renderProposal(proposal) {
    let { votingManagerStore } = this.props;

    return (
      <li key={proposal.id}>
        {
          proposal.isClosed ?
            <div>
              <p>
                YES: "{proposal.title}" <br/>
                {proposal.description} <br/>
                Voting closed on {proposal.closedDate.toISOString()}: {proposal.yesResults}% in favor <br/>
                {proposal.percentages.YES}% YES, {proposal.percentages.NO}% NO, {proposal.percentages.ABSTAIN}%
                ABSTAIN, {proposal.percentages.NO_SHOW}% no show<br/>
                {proposal.hasVoted ?
                  `You voted ${proposal.ownVote}`
                  :
                  "You did not vote"
                }
              </p>
            </div>
            :
            <div>
              <p>
                Proposal: "{proposal.title}" <br/>
                {proposal.description} <br/>
                Voting will close on {proposal.deadlineDate.toISOString()}. <br/>
                {proposal.percentageOfVotesMade}% of the votes have been made
              </p>
              {proposal.hasVoted ?
                <span>You voted {proposal.ownVote}</span>
                :
                <div>
                  Please vote:
                  <button className="btn btn-xs btn-primary vote-button" type="button"
                          onClick={() => this.saveVote(proposal, 0)}
                          disabled={votingManagerStore.get("voting")}>
                    Yes
                  </button>

                  <button className="btn btn-xs btn-danger vote-button" type="button"
                          onClick={() => this.saveVote(proposal, 1)}
                          disabled={votingManagerStore.get("voting")}>
                    No
                  </button>

                  <button className="btn btn-xs btn-info vote-button" type="button"
                          onClick={() => this.saveVote(proposal, 2)}
                          disabled={votingManagerStore.get("voting")}>
                    Abstain
                  </button>

                </div>
              }

            </div>
        }
      </li>
    );
  }

  render() {
    let { proposals } = this.props;

    return (
      <ul>
        {proposals ? _.orderBy(proposals, ['start'], ['desc']).map((proposal) => this.renderProposal(proposal)) : null}
      </ul>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    web3Store: state.web3Store,
    votingManagerStore: state.votingManagerStore,
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
)(ProposalsList);