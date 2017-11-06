pragma solidity ^0.4.15;


import "./Ownable.sol";
import "./CrowdOwned.sol";
import "./Registry.sol";


contract CrowdOwnedManager is Ownable {
  /*
   *  Events
   */
  event CrowdOwnedDeployed(address indexed contractAddress, string name, string symbol);

  /*
  *  Storage
  */
  Registry public registry;

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
  function CrowdOwnedManager(Registry _registry) {
    registry = _registry;
  }

  /**
  * @dev deploy CrowdOwned contract
  */
  function deployCrowdOwned(string _name, string _symbol) public onlyRegistryOwner {
    // deploy contract
    CrowdOwned crowdOwned = new CrowdOwned(_name, _symbol, msg.sender, registry);

    var contractAddress = address(crowdOwned);

    contractsData[contractAddress].name = _name;
    contractsData[contractAddress].symbol = _symbol;
    contractsData[contractAddress].isContractData = true;
    contractsAddresses.push(contractAddress);

    // Log event
    CrowdOwnedDeployed(contractAddress, _name, _symbol);
  }

  /**
  * @dev get all contract addresses
  */
  function getContractsAddresses() public constant returns (address[])  {
    return contractsAddresses;
  }

}