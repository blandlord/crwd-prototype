pragma solidity ^0.4.18;

import "./SafeMath.sol";
import "./Ownable.sol";
import "./CrowdOwned.sol";

contract VotingManager is Ownable {
  using SafeMath for uint;

  /*
   * Events
   */
  event NewProposal(address indexed creator, uint id);

  /*
   * Storage
   */

  // Mapping of Token address => Proposals
  mapping(address => Proposal[]) public proposals;

  struct Proposal {
    address creator;
    string title;
    string description;
    uint start;
    uint deadline;
    uint tokensCirculatingSupply;
    mapping(address => uint) tokensOwned;
    mapping(address => bool) voted;
    mapping(address => VoteChoice) votes;
    uint yesWeightedTotal;
    uint noWeightedTotal;
    uint abstainWeightedTotal;
    bool isProposal;
  }


  enum VoteChoice {YES, NO, ABSTAIN}

  /*
   * Public functions
   */

  /**
  * @dev Contract constructor
  */
  function VotingManager() public {

  }

  /**
  * @dev Create Proposal
  * @param _crowdOwned Crowd Owned Address
  * @param _title Title
  * @param _description Description
  * @param _duration Duration in number of blocks
  */
  function createProposal(CrowdOwned _crowdOwned, string _title, string _description, uint _duration) public {
    // check creator is owner
    require(_crowdOwned.balanceOf(msg.sender) > 0);

    address crowdOwnedAddress = address(_crowdOwned);

    // create proposal
    uint proposalId = getProposalsLength(crowdOwnedAddress) + 1;

    Proposal storage proposal;

    proposal.creator = msg.sender;
    proposal.title = _title;
    proposal.description = _description;
    proposal.start = block.number;
    proposal.deadline = block.number.add(_duration);
    proposal.isProposal = true;

    proposals[crowdOwnedAddress].push(proposal);

    // take token circulation/ownership snapshot
    saveTokensOwned(crowdOwnedAddress, proposalId);

    NewProposal(msg.sender, proposalId);
  }

  /**
  * @dev Take Tokens Ownership Snapshot
  * @param _proposalId Proposal Id
  */
  function saveTokensOwned(address _crowdOwnedAddress, uint _proposalId) internal {
    require(_proposalId >= 1);

    Proposal storage proposal = proposals[_crowdOwnedAddress][_proposalId - 1];

    // save circulating supply at the proposal creation
    proposal.tokensCirculatingSupply = CrowdOwned(_crowdOwnedAddress).circulatingSupply();

    uint ownerAddressesLength = CrowdOwned(_crowdOwnedAddress).getOwnerAddressesLength();

    // save tokens owned snapshot
    for (uint i = 0; i < ownerAddressesLength; i++) {
      address ownerAddress = CrowdOwned(_crowdOwnedAddress).ownerAddresses(i);

      // do not take tokens owned by the contract into account
      if (ownerAddress != _crowdOwnedAddress) {
        proposal.tokensOwned[ownerAddress] = CrowdOwned(_crowdOwnedAddress).balanceOf(ownerAddress);
      }
    }
  }

  /**
  * @dev Vote for proposal
  * @param _tokenAddress Token Address
  * @param _proposalId Proposal id
  * @param _choice Vote Choice
  */
  function vote(address _tokenAddress, uint _proposalId, uint _choice) public {
    // check proposal exists
    require(proposals[_tokenAddress][_proposalId - 1].isProposal);
    // check proposal still ongoing
    require(proposals[_tokenAddress][_proposalId - 1].deadline > block.number);
    // check voter was owner at proposal creation time
    require(getProposalTokensOwned(_tokenAddress, _proposalId, msg.sender) > 0);
    // check hasn't voted already
    require(!hasVoted(_tokenAddress, _proposalId, msg.sender));
    // check vote valid 
    require(VoteChoice(_choice) == VoteChoice.YES || VoteChoice(_choice) == VoteChoice.NO || VoteChoice(_choice) == VoteChoice.ABSTAIN);

    uint weightedVote = getProposalTokensOwned(_tokenAddress, _proposalId, msg.sender);

    // count vote in
    if (VoteChoice(_choice) == VoteChoice.YES) {
      proposals[_tokenAddress][_proposalId - 1].yesWeightedTotal += weightedVote;
    }
    else if (VoteChoice(_choice) == VoteChoice.NO) {
      proposals[_tokenAddress][_proposalId - 1].noWeightedTotal += weightedVote;
    }
    else if (VoteChoice(_choice) == VoteChoice.ABSTAIN) {
      proposals[_tokenAddress][_proposalId - 1].abstainWeightedTotal += weightedVote;
    }

    // save choice
    proposals[_tokenAddress][_proposalId - 1].votes[msg.sender] = VoteChoice(_choice);

    // mark has voted
    proposals[_tokenAddress][_proposalId - 1].voted[msg.sender] = true;
  }

  /**
  * @dev Get number of proposals
  * @param _tokenAddress Token Address
  */
  function getProposalsLength(address _tokenAddress) constant public returns (uint length){
    return proposals[_tokenAddress].length;
  }

  /**
  * @dev Get proposal
  * @param _tokenAddress Token Address
  * @param _proposalId Proposal id
  */
  function getProposal(address _tokenAddress, uint _proposalId) constant public
  returns (
    address creator,
    string title,
    string description,
    uint start,
    uint deadline,
    uint tokensCirculatingSupply,
    uint yesWeightedTotal,
    uint noWeightedTotal,
    uint abstainWeightedTotal,
    bool isProposal
  ){
    Proposal memory proposal = proposals[_tokenAddress][_proposalId - 1];

    return (
    proposal.creator,
    proposal.title,
    proposal.description,
    proposal.start,
    proposal.deadline,
    proposal.tokensCirculatingSupply,
    proposal.yesWeightedTotal,
    proposal.noWeightedTotal,
    proposal.abstainWeightedTotal,
    proposal.isProposal
    );
  }

  /**
  * @dev Get tokens owned by address at proposal creation time
  * @param _tokenAddress Token Address
  * @param _proposalId Proposal id
  * @param _ownerAddress Owner Address
  */
  function getProposalTokensOwned(address _tokenAddress, uint _proposalId, address _ownerAddress) constant public returns (uint tokensOwned){

    return proposals[_tokenAddress][_proposalId - 1].tokensOwned[_ownerAddress];
  }

  /**
  * @dev checks if address has voted
  * @param _tokenAddress Token Address
  * @param _proposalId Proposal id
  * @param _ownerAddress Owner Address
  */
  function hasVoted(address _tokenAddress, uint _proposalId, address _ownerAddress) constant public returns (bool voted){

    return proposals[_tokenAddress][_proposalId - 1].voted[_ownerAddress];
  }

  /**
  * @dev get my vote
  * @param _tokenAddress Token Address
  * @param _proposalId Proposal id
  */
  function getMyVote(address _tokenAddress, uint _proposalId) constant public returns (uint voteChoice){

    return uint(proposals[_tokenAddress][_proposalId - 1].votes[msg.sender]);
  }

  /**
  * @dev get yes weighted percentage
  * @param _tokenAddress Token Address
  * @param _proposalId Proposal id
  */
  function getYesResults(address _tokenAddress, uint _proposalId) constant public returns (uint){

    return (proposals[_tokenAddress][_proposalId - 1].yesWeightedTotal * 100) / (proposals[_tokenAddress][_proposalId - 1].yesWeightedTotal + proposals[_tokenAddress][_proposalId - 1].noWeightedTotal);
  }

}