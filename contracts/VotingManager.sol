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
    Vote[] votes;
    mapping(address => bool) voted;
    bool isProposal;
  }

  struct Vote {
    VoteChoice choice;
    address voter;
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
   // require(_crowdOwned.balanceOf(msg.sender) > 0);

    address crowdOwnedAddress = address(_crowdOwned);

    // create proposal
    uint proposalId = getProposalsLength(crowdOwnedAddress) + 1;

    proposals[crowdOwnedAddress][proposalId].creator = msg.sender;
    proposals[crowdOwnedAddress][proposalId].title = _title;
    proposals[crowdOwnedAddress][proposalId].description = _description;
    proposals[crowdOwnedAddress][proposalId].start = block.number;
    proposals[crowdOwnedAddress][proposalId].deadline = block.number.add(_duration);
    proposals[crowdOwnedAddress][proposalId].isProposal = true;

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
      proposal.tokensOwned[ownerAddress] = CrowdOwned(_crowdOwnedAddress).balanceOf(ownerAddress);
    }
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
  function getOrder(address _tokenAddress, uint _proposalId) constant public
  returns (address creator,
    string title,
    string description,
    uint deadline,
    uint tokensCirculatingSupply,
    bool isProposal){
    Proposal memory proposal = proposals[_tokenAddress][_proposalId];
    return (proposal.creator,
    proposal.title,
    proposal.description,
    proposal.deadline,
    proposal.tokensCirculatingSupply,
    proposal.isProposal);
  }

}