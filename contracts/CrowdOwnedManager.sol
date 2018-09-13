pragma solidity ^0.4.24;


import "./Ownable.sol";
import "./CrowdOwned.sol";
import "./Registry.sol";
import "./CRWDToken.sol";
import "./CrowdOwnedExchange.sol";


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

  CrowdOwnedExchange public crowdOwnedExchange;

  mapping(address => ContractData) public contractsData;

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
   * @dev Throws if called by any account other than a registry notary.
   */
  modifier onlyRegistryNotary() {
    require(registry.isNotaryAddress(msg.sender));
    _;
  }

  /*
  * Public functions
  */
  /// @dev Contract constructor
  constructor(Registry _registry, CRWDToken _crwdToken, CrowdOwnedExchange _crowdOwnedExchange) public {
    registry = _registry;
    crwdToken = _crwdToken;
    crowdOwnedExchange = _crowdOwnedExchange;
  }

  /**
  * @dev deploy CrowdOwned contract
  */
  function deployCrowdOwned(string _name, string _symbol, string _imageUrl) public onlyRegistryNotary {
    // deploy contract
    CrowdOwned crowdOwned = new CrowdOwned(_name, _symbol, _imageUrl, msg.sender, registry, crowdOwnedExchange);

    address contractAddress = address(crowdOwned);

    contractsData[contractAddress].name = _name;
    contractsData[contractAddress].symbol = _symbol;
    contractsData[contractAddress].isContractData = true;
    contractsAddresses.push(contractAddress);

    // Log event
    emit CrowdOwnedDeployed(contractAddress, _name, _symbol, _imageUrl);
  }

  /**
  * @dev get all contract addresses
  */
  function getContractsAddresses() public constant returns (address[])  {
    return contractsAddresses;
  }

}