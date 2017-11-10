pragma solidity ^0.4.15;


import './StandardToken.sol';
import './Ownable.sol';
import './Registry.sol';
import './CrowdOwnedManager.sol';


contract CrowdOwned is StandardToken, Ownable {

  /*
   * Storage
   */
  Registry public registry;

  string public  name;

  string public  symbol;

  string public  imageUrl;

  mapping (address => bool) ownerAddressInitialized;

  address[] public ownerAddresses;

  /*
   * Constants
   */
  uint256 public constant INITIAL_SUPPLY = 100000;

  /*
   * Public functions
   */

  /**
  * @dev Contract constructor
  * @param _name Contract Name
  * @param _symbol Contract Symbol
  * @param _imageUrl CrowdOwned Object Image Url
  */
  function CrowdOwned(string _name, string _symbol, string _imageUrl, address _owner, Registry _registry) {
    name = _name;
    symbol = _symbol;
    imageUrl = _imageUrl;

    // override Ownable constructor to allow indirect deployment
    owner = _owner;

    // set registry
    registry = _registry;

    totalSupply = INITIAL_SUPPLY;
    balances[_owner] = INITIAL_SUPPLY;

    // add owner to list
    tryAddOwnerAddress(_owner);
  }

  /**
  * @dev set registry contract address
  * @param _registry Registry contract address
  */
  function setRegistry(Registry _registry) public onlyOwner {
    registry = _registry;
  }

  /**
  * @dev overwrite token transfer function to check registry before transfer
  * @param _to The address to transfer to.
  * @param _value The amount to be transferred.
  */
  function transfer(address _to, uint256 _value) public returns (bool) {
    require(isValidTransfer(_to));

    // add owner address if necessary
    tryAddOwnerAddress(_to);

    return super.transfer(_to, _value);
  }

  /**
  * @dev overwrite token transferFrom function to check registry before transfer
  * @param _to The address to transfer to.
  * @param _value The amount to be transferred.
  */
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
    require(isValidTransfer(_to));

    // add owner address if necessary
    tryAddOwnerAddress(_to);

    return super.transferFrom(_from, _to, _value);
  }

  /**
  * @dev check if transfer is valid
  * @param _to The address to transfer to.
  */
  function isValidTransfer(address _to) public constant returns (bool){
    return (_to == address(this) || registry.isVerifiedAndValid(_to));
  }

  /**
  * @dev get tokens circulating supply
  */
  function circulatingSupply() public constant returns (uint) {
    return totalSupply - balanceOf(address(this));
  }

  /**
  * @dev Add owner address if necessary
  * @param _address Owner Address to be added
  */
  function tryAddOwnerAddress(address _address) internal {
    if (!ownerAddressInitialized[_address]) {
      ownerAddresses.push(_address);
      ownerAddressInitialized[_address] = true;
    }
  }

  /**
  * @dev get owner addresses
  */
  function getOwnerAddresses() public constant returns (address[]) {
    return ownerAddresses;
  }

}