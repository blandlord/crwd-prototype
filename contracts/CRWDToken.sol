pragma solidity ^0.4.15;


import './StandardToken.sol';
import './Ownable.sol';
import './Registry.sol';


contract CRWDToken is StandardToken, Ownable {

  /*
   * Events
   */

  /*
   * Storage
   */
  Registry public registry;

  string public  name;

  string public  symbol;

  /*
   * Constants
   */
  uint256 public constant INITIAL_SUPPLY = 100000;

  /*
   * Public functions
   */
  /// @dev Contract constructor
  function CRWDToken(string _name, string _symbol) {
    totalSupply = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
    name = _name;
    symbol = _symbol;
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
    require(registry.isVerifiedAndValid(_to));

    return super.transfer(_to, _value);
  }

  /**
  * @dev overwrite token transferFrom function to check registry before transfer
  * @param _to The address to transfer to.
  * @param _value The amount to be transferred.
  */
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
    require(registry.isVerifiedAndValid(_to));

    return super.transferFrom(_from, _to, _value);
  }

}