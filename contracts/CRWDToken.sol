pragma solidity ^0.5.0;


import './StandardToken.sol';

contract CRWDToken is StandardToken {

  /*
   * Storage
   */

  string public constant name = "Crowd City";
  string public constant symbol = "CRWD";
  uint8 public constant decimals = 18;

  uint256 public constant INITIAL_SUPPLY = 100000000 * (10 ** uint256(decimals));

  /*
   * Public functions
   */

  /**
  * @dev Contract constructor
  */
  constructor() public {
    totalSupply_ = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
  }

}