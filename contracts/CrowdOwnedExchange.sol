pragma solidity ^0.4.15;


import './Ownable.sol';
import './Registry.sol';
import './CrowdOwned.sol';
import './CRWDToken.sol';
import './SafeMath.sol';


contract CrowdOwnedExchange is Ownable {
  using SafeMath for uint;

  /*
   *  Events
   */

  event TokenDeposit(address indexed userAddress, address indexed tokenAddress, uint amount, uint balance);

  event TokenWithdrawal(address indexed userAddress, address indexed tokenAddress, uint amount, uint balance);

  event CRWDDeposit(address indexed userAddress, uint amount, uint balance);

  event CRWDWithdrawal(address indexed userAddress, uint amount, uint balance);


  /*
   * Storage
   */
  Registry public registry;

  CRWDToken public crwdToken;

  enum OrderType {BUY, SELL}

  struct Order {
    OrderType orderType;
    uint price;
    uint amount;
    address userAddress;
    bool executed;
    bool canceled;
    bool isOrder;
  }

  // Mapping of Token address => User Address => balance
  mapping(address => mapping(address => uint)) public tokenBalances;

  // CRWDToken Balances by user
  mapping(address => uint) public crwdBalances;

  // Mapping of Token address => Order Id => Order
  mapping(address => mapping(uint => Order)) public orders;

  // Mapping of Token address => Order Ids
  mapping(address => uint[]) public orderIds;

  /*
   * Constants
   */

  /*
   * Public functions
   */

  /**
  * @dev Contract constructor
  * @param _registry Registry address
  */
  function CrowdOwnedExchange(Registry _registry, CRWDToken _crwdToken) public {
    // prevent setting to null
    require(_registry != address(0));
    require(_crwdToken != address(0));

    // set registry
    registry = _registry;
    // set crwdToken
    crwdToken = _crwdToken;
  }

  /**
  * @dev deposit tokens into the contract
  * @param _token Token Address
  * @param _amount Amount to deposit
  */
  function depositCrowdOwnedTokens(CrowdOwned _token, uint _amount) public {
    require(_amount > 0);

    // token.approve needs to be called beforehand
    // transfer tokens from the user to the contract
    require(_token.transferFrom(msg.sender, this, _amount));

    // add the tokens to the user's balance
    tokenBalances[address(_token)][msg.sender] = tokenBalances[address(_token)][msg.sender].add(_amount);

    TokenDeposit(msg.sender, address(_token), _amount, tokenBalances[address(_token)][msg.sender]);
  }

  /**
  * @dev withdraw tokens from the contract
  * @param _token Token Address
  * @param _amount Amount to withdraw
  */
  function withdrawCrowdOwnedTokens(CrowdOwned _token, uint _amount) public {
    require(tokenBalances[address(_token)][msg.sender] >= _amount);

    // subtract the tokens from the user's balance
    tokenBalances[address(_token)][msg.sender] = tokenBalances[address(_token)][msg.sender].sub(_amount);

    // transfer tokens from the contract to the user
    require(_token.transfer(msg.sender, _amount));

    TokenWithdrawal(msg.sender, address(_token), _amount, tokenBalances[address(_token)][msg.sender]);
  }

  /**
  * @dev Get user token balance
  * @param _userAddress User Address
  */
  function tokenBalanceOf(address _token, address _userAddress) constant public returns (uint) {
    return tokenBalances[_token][_userAddress];
  }

  /**
  * @dev deposit CRWD tokens into the contract
  * @param _amount Amount to deposit
  */
  function depositCRWDTokens(uint _amount) public {
    require(_amount > 0);

    // token.approve needs to be called beforehand
    // transfer tokens from the user to the contract
    require(crwdToken.transferFrom(msg.sender, this, _amount));

    // add the tokens to the user's balance
    crwdBalances[msg.sender] = crwdBalances[msg.sender].add(_amount);

    CRWDDeposit(msg.sender, _amount, crwdBalances[msg.sender]);
  }

  /**
  * @dev withdraw CRWD tokens from the contract
  * @param _amount Amount to withdraw
  */
  function withdrawCRWDTokens(uint _amount) public {
    require(crwdBalances[msg.sender] >= _amount);

    // subtract the tokens from the user's balance
    crwdBalances[msg.sender] = crwdBalances[msg.sender].sub(_amount);

    // transfer tokens from the contract to the user
    require(crwdToken.transfer(msg.sender, _amount));

    CRWDWithdrawal(msg.sender, _amount, crwdBalances[msg.sender]);
  }

  /**
 * @dev Get user CRWD token balance
 * @param _userAddress User Address
 */
  function crwdBalanceOf(address _userAddress) constant public returns (uint) {
    return crwdBalances[_userAddress];
  }

}