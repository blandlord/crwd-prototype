pragma solidity ^0.5.0;

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
  constructor() public {

  }

  /**
  * @dev Create Proposal
  * @param _crowdOwned Crowd Owned Address
  * @param _title Title
  * @param _description Description
  * @param _duration Duration in seconds
  */
  function createProposal(CrowdOwned _crowdOwned, string memory _title, string memory _description, uint _duration) public {
    // check creator is owner
    require(_crowdOwned.balanceOf(msg.sender) > 0);

    // check duration is not null
    require(_duration > 0);

    address crowdOwnedAddress = address(_crowdOwned);

    // create proposal
    uint proposalId = getProposalsLength(crowdOwnedAddress) + 1;

  /*  Proposal storage proposal;

    proposal.creator = msg.sender;
    proposal.title = _title;
    proposal.description = _description;
    proposal.start = block.timestamp.mul(1000); // convert to milliseconds
    proposal.deadline = (block.timestamp.add(_duration)).mul(1000);
    proposal.isProposal = true;*/


    proposals[crowdOwnedAddress].push(Proposal({
      creator : msg.sender,
      title : _title,
      description : _description,
      start : block.timestamp.mul(1000), // convert to milliseconds
      deadline : (block.timestamp.add(_duration)).mul(1000),
      isProposal : true,
      tokensCirculatingSupply : 0,
      noWeightedTotal : 0,
      yesWeightedTotal : 0,
      abstainWeightedTotal : 0
      }));

    // take token circulation/ownership snapshot
    saveTokensOwned(_crowdOwned, proposalId);

    emit NewProposal(msg.sender, proposalId);
  }

  /**
  * @dev Take Tokens Ownership Snapshot
  * @param _proposalId Proposal Id
  */
  function saveTokensOwned(CrowdOwned _crowdOwned, uint _proposalId) internal {
    require(_proposalId >= 1);

    Proposal storage proposal = proposals[address(_crowdOwned)][_proposalId - 1];

    // save circulating supply at the proposal creation
    proposal.tokensCirculatingSupply = _crowdOwned.circulatingSupply();

    uint ownerAddressesLength = _crowdOwned.getOwnerAddressesLength();

    // save tokens owned snapshot
    for (uint i = 0; i < ownerAddressesLength; i++) {
      address ownerAddress = _crowdOwned.ownerAddresses(i);

      // do not take tokens owned by the contract into account
      if (ownerAddress != address(_crowdOwned)) {
        proposal.tokensOwned[ownerAddress] = _crowdOwned.balanceOf(ownerAddress);
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
    require(!isClosed(_tokenAddress, _proposalId));
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
  function getProposalsLength(address _tokenAddress) view public returns (uint length){
    return proposals[_tokenAddress].length;
  }

  /**
  * @dev Get proposal
  * @param _tokenAddress Token Address
  * @param _proposalId Proposal id
  */
  function getProposal(address _tokenAddress, uint _proposalId) view public
  returns (
    address creator,
    string memory title,
    string memory description,
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
  function getProposalTokensOwned(address _tokenAddress, uint _proposalId, address _ownerAddress) view public returns (uint tokensOwned){

    return proposals[_tokenAddress][_proposalId - 1].tokensOwned[_ownerAddress];
  }

  /**
  * @dev checks if address has voted
  * @param _tokenAddress Token Address
  * @param _proposalId Proposal id
  * @param _ownerAddress Owner Address
  */
  function hasVoted(address _tokenAddress, uint _proposalId, address _ownerAddress) view public returns (bool voted){

    return proposals[_tokenAddress][_proposalId - 1].voted[_ownerAddress];
  }

  /**
  * @dev get my vote
  * @param _tokenAddress Token Address
  * @param _proposalId Proposal id
  */
  function getMyVote(address _tokenAddress, uint _proposalId) view public returns (uint voteChoice){

    return uint(proposals[_tokenAddress][_proposalId - 1].votes[msg.sender]);
  }

  /**
  * @dev get yes weighted percentage
  * @param _tokenAddress Token Address
  * @param _proposalId Proposal id
  */
  function getYesResults(address _tokenAddress, uint _proposalId) view public returns (uint){

    return (proposals[_tokenAddress][_proposalId - 1].yesWeightedTotal * 100) / (proposals[_tokenAddress][_proposalId - 1].yesWeightedTotal + proposals[_tokenAddress][_proposalId - 1].noWeightedTotal);
  }

  /**
   * @dev checks if proposal voting closed
   * @param _tokenAddress Token Address
   * @param _proposalId Proposal id
   */
  function isClosed(address _tokenAddress, uint _proposalId) view public returns (bool closed){

    return proposals[_tokenAddress][_proposalId - 1].deadline <= block.timestamp;
  }

}