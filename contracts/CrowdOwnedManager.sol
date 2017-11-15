pragma solidity ^0.4.15;


import "./Ownable.sol";
import "./CrowdOwned.sol";
import "./Registry.sol";
import "./CRWDToken.sol";


contract CrowdOwnedManager is Ownable {
  /*
   *  Events
   */
  event CrowdOwnedDeployed(address indexed contractAddress, string name, string symbol, string imageUrl);

  /*
  *  Storage
  */
  Registry public registry;

  CRWDToken public crwdToken;

  mapping (address => ContractData) public contractsData;

  address[] public contractsAddresses;

  struct ContractData {
  string name;
  string symbol;
  bool isContractData;
  }

  /*
  * modifier
  */

  /**
   * @dev Throws if called by any account other than the registry owner.
   */
  modifier onlyRegistryOwner() {
    require(msg.sender == registry.owner());
    _;
  }

  /*
  * Public functions
  */
  /// @dev Contract constructor
  function CrowdOwnedManager(Registry _registry, CRWDToken _crwdToken) {
    registry = _registry;
    crwdToken = _crwdToken;
  }

  /**
  * @dev deploy CrowdOwned contract
  */
  function deployCrowdOwned(string _name, string _symbol, string _imageUrl) public onlyRegistryOwner {
    // deploy contract
    CrowdOwned crowdOwned = new CrowdOwned(_name, _symbol, _imageUrl, msg.sender, registry);

    var contractAddress = address(crowdOwned);

    contractsData[contractAddress].name = _name;
    contractsData[contractAddress].symbol = _symbol;
    contractsData[contractAddress].isContractData = true;
    contractsAddresses.push(contractAddress);

    // Log event
    CrowdOwnedDeployed(contractAddress, _name, _symbol, _imageUrl);
  }

  /**
  * @dev get all contract addresses
  */
  function getContractsAddresses() public constant returns (address[])  {
    return contractsAddresses;
  }

  /**
  * @dev check if crowd owned is alive
  */
  function isCrowdOwnedAlive(address crowdOwnedAddress) public constant returns (bool)  {
    return (CrowdOwned(crowdOwnedAddress).owner() != address(0));
  }


}