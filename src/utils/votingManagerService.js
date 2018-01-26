import contractService from '../utils/contractService';

const promisify = require("promisify-es6");
const _ = require("lodash");
const moment = require("moment");

let VOTE_CHOICE = {
  YES: 0,
  NO: 1,
  ABSTAIN: 2,
};

async function createProposal(web3, newProposal) {
  const votingManagerInstance = await contractService.getDeployedInstance(web3, "VotingManager");

  let results = await votingManagerInstance.createProposal(
    newProposal.crowdOwnedAddress,
    newProposal.title,
    newProposal.description,
    newProposal.duration,
    {
      from: web3.eth.defaultAccount,
      gas: 2000000
    });
  return results;
}


async function loadProposals(web3, crowdOwnedAddress) {
  const votingManagerInstance = await contractService.getDeployedInstance(web3, "VotingManager");

  let proposalsLength = await votingManagerInstance.getProposalsLength(crowdOwnedAddress);

  const proposals = [];

  for (let i = 0; i < proposalsLength.toNumber(); i++) {
    let proposalId = i + 1;

    const values = await votingManagerInstance.getProposal(crowdOwnedAddress, proposalId);
    let isProposal = values[9]; // make sure value exists
    if (isProposal) {
      let proposal = {
        id: proposalId,
        creator: values[0],
        title: values[1],
        description: values[2],
        start: values[3].toNumber(),
        deadline: values[4].toNumber(),
        tokensCirculatingSupply: values[5].toNumber(),
        yesWeightedTotal: values[6].toNumber(),
        noWeightedTotal: values[7].toNumber(),
        abstainWeightedTotal: values[8].toNumber(),
        crowdOwnedAddress: crowdOwnedAddress
      };

      let startBlock = await promisify(web3.eth.getBlock)(proposal.start);
      proposal.startDate = new Date(startBlock.timestamp * 1000);
      proposal.deadlineDate = moment(proposal.startDate).add((proposal.deadline - proposal.start) * 15, 'second');

      let isClosed = await votingManagerInstance.isClosed(crowdOwnedAddress, proposalId);
      proposal.isClosed = isClosed;

      if (isClosed) {
        let closedBlock = await promisify(web3.eth.getBlock)(proposal.deadline);
        proposal.closedDate = new Date(closedBlock.timestamp * 1000);

        let yesResults = _.round(100 * (proposal.yesWeightedTotal) / (proposal.yesWeightedTotal + proposal.noWeightedTotal), 1);
        proposal.yesResults = yesResults;
        proposal.granted = proposal.yesResults > 50;

        proposal.percentages = {
          YES: _.round(100 * (proposal.yesWeightedTotal) / proposal.tokensCirculatingSupply, 0),
          NO: _.round(100 * (proposal.noWeightedTotal) / proposal.tokensCirculatingSupply, 0),
          ABSTAIN: _.round(100 * (proposal.abstainWeightedTotal) / proposal.tokensCirculatingSupply, 0),
        };

        proposal.percentages.NO_SHOW = 100 - proposal.percentages.YES - proposal.percentages.NO - proposal.percentages.ABSTAIN;
      }
      else {
        let percentageOfVotesMade = _.round(100 * (proposal.yesWeightedTotal + proposal.noWeightedTotal + proposal.abstainWeightedTotal) / proposal.tokensCirculatingSupply, 0);
        proposal.percentageOfVotesMade = percentageOfVotesMade;
      }

      let hasVoted = await votingManagerInstance.hasVoted(crowdOwnedAddress, proposalId, web3.eth.defaultAccount);
      proposal.hasVoted = hasVoted;

      if (hasVoted) {
        let ownVote = await votingManagerInstance.getMyVote(crowdOwnedAddress, proposalId, { from: web3.eth.defaultAccount });
        proposal.ownVote = _.invert(VOTE_CHOICE)[ownVote.toNumber()];
      }

      proposals.push(proposal);
    }
  }

  return proposals;
}

async function vote(web3, voteData) {
  const votingManagerInstance = await contractService.getDeployedInstance(web3, "VotingManager");

  let results = await votingManagerInstance.vote(
    voteData.crowdOwnedAddress,
    voteData.proposalId,
    voteData.choice,
    {
      from: web3.eth.defaultAccount,
      gas: 200000
    });
  return results;
}

let votingManagerService = {
  createProposal,
  loadProposals,
  vote,

  VOTE_CHOICE,
};

export default votingManagerService;