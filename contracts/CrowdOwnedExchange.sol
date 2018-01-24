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

  event TokenDeposit(address indexed _userAddress, address indexed _tokenAddress, uint _amount, uint _balance);
  event TokenWithdrawal(address indexed _userAddress, address indexed _tokenAddress, uint _amount, uint _balance);
  event CRWDDeposit(address indexed _userAddress, uint _amount, uint _balance);
  event CRWDWithdrawal(address indexed _userAddress, uint _amount, uint _balance);
  event OrderCreated(address indexed _tokenAddress, uint _orderType, uint _price, uint _amount, address _userAddress, uint _orderId);
  event OrderCanceled(address indexed _tokenAddress, uint _orderId);
  event OrderTaken(address indexed _tokenAddress, uint _orderId, address indexed _takerAddress);
  event LockedTokenBalance(address indexed _userAddress, address indexed _tokenAddress, uint amount);
  event UnlockedTokenBalance(address indexed _userAddress, address indexed _tokenAddress, uint amount);
  event LockedCrwdBalance(address indexed _userAddress, uint amount);
  event UnlockedCrwdBalance(address indexed _userAddress, uint amount);

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

  // Mapping of Token address => User Address => locked balance
  mapping(address => mapping(address => uint)) public lockedTokenBalances;

  // CRWDToken Balances by user
  mapping(address => uint) public crwdBalances;

  // CRWDToken Locked Balances by user
  mapping(address => uint) public lockedCrwdBalances;

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
  * @param _crwdToken CRWD Token address
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

    // Log event
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

    // Log event
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
  * @dev Get user locked token balance
  * @param _userAddress User Address
  */
  function lockedTokenBalanceOf(address _token, address _userAddress) constant public returns (uint) {
    return lockedTokenBalances[_token][_userAddress];
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

    // Log event
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

    // Log event
    CRWDWithdrawal(msg.sender, _amount, crwdBalances[msg.sender]);
  }

  /**
  * @dev Get user CRWD token balance
  * @param _userAddress User Address
  */
  function crwdBalanceOf(address _userAddress) constant public returns (uint) {
    return crwdBalances[_userAddress];
  }

  /**
  * @dev Get user locked CRWD token balance
  * @param _userAddress User Address
  */
  function lockedCrwdBalanceOf(address _userAddress) constant public returns (uint) {
    return lockedCrwdBalances[_userAddress];
  }

  /**
  * @dev Create order
  * @param _tokenAddress Token Address
  * @param _orderType Order Type
  * @param _price Price
  * @param _amount Amount
  */
  function createOrder(address _tokenAddress, uint _orderType, uint _price, uint _amount) public {
    // check params
    require(_tokenAddress != address(0));
    require(OrderType(_orderType) == OrderType.BUY || OrderType(_orderType) == OrderType.SELL);
    require(_price > 0);
    require(_amount > 0);

    // check verified registry user
    require(registry.isVerifiedAndValid(msg.sender));
    // check balance is sufficient
    require(isBalanceSufficient(true, _tokenAddress, OrderType(_orderType), _price, _amount));

    // lock user balance
    if (OrderType(_orderType) == OrderType.BUY) {
      lockCrwdBalance(msg.sender, _price.mul(_amount));
    }
    else {
      lockTokenBalance(msg.sender, _tokenAddress, _amount);
    }

    // create order
    uint orderId = getOrdersLength(_tokenAddress) + 1;
    orders[_tokenAddress][orderId].orderType = OrderType(_orderType);
    orders[_tokenAddress][orderId].price = _price;
    orders[_tokenAddress][orderId].amount = _amount;
    orders[_tokenAddress][orderId].userAddress = msg.sender;
    orders[_tokenAddress][orderId].isOrder = true;
    orderIds[_tokenAddress].push(orderId);

    // Log event
    OrderCreated(_tokenAddress, _orderType, _price, _amount, msg.sender, orderId);
  }

  /**
  * @dev Lock user token balance  
  * @param _userAddress User Address
  * @param _tokenAddress Token Address
  * @param _amount Amount to be locked
  */
  function lockTokenBalance(address _userAddress, address _tokenAddress, uint _amount) internal {
    require(tokenBalances[_tokenAddress][_userAddress] >= _amount);

    // subtract the tokens from the user's balance
    tokenBalances[_tokenAddress][_userAddress] = tokenBalances[_tokenAddress][_userAddress].sub(_amount);

    // add the tokens to the user's locked balance
    lockedTokenBalances[_tokenAddress][_userAddress] = lockedTokenBalances[_tokenAddress][_userAddress].add(_amount);

    LockedTokenBalance(_userAddress, _tokenAddress, _amount);
  }

  /**
  * @dev Unlock user token balance  
  * @param _userAddress User Address
  * @param _tokenAddress Token Address
  * @param _amount Amount to be unlocked
  */
  function unlockTokenBalance(address _userAddress, address _tokenAddress, uint _amount) internal {
    require(lockedTokenBalances[_tokenAddress][_userAddress] >= _amount);

    // subtract the tokens from the user's locked balance
    lockedTokenBalances[_tokenAddress][_userAddress] = lockedTokenBalances[_tokenAddress][_userAddress].sub(_amount);

    // add the tokens to the user's balance
    tokenBalances[_tokenAddress][_userAddress] = tokenBalances[_tokenAddress][_userAddress].add(_amount);

    UnlockedTokenBalance(_userAddress, _tokenAddress, _amount);
  }

  /**
  * @dev Lock user crwd balance
  * @param _userAddress User Address
  * @param _amount Amount to be locked
  */
  function lockCrwdBalance(address _userAddress, uint _amount) internal {
    require(crwdBalances[_userAddress] >= _amount);

    // subtract the tokens from the user's balance
    crwdBalances[_userAddress] = crwdBalances[_userAddress].sub(_amount);

    // add the tokens to the user's locked balance
    lockedCrwdBalances[_userAddress] = lockedCrwdBalances[_userAddress].add(_amount);

    LockedCrwdBalance(_userAddress, _amount);
  }

  /**
  * @dev Unlock user crwd balance
  * @param _userAddress User Address
  * @param _amount Amount to be unlocked
  */
  function unlockCrwdBalance(address _userAddress, uint _amount) internal {
    require(lockedCrwdBalances[_userAddress] >= _amount);

    // subtract the tokens from the user's locked balance
    lockedCrwdBalances[_userAddress] = lockedCrwdBalances[_userAddress].sub(_amount);

    // add the tokens to the user's balance
    crwdBalances[_userAddress] = crwdBalances[_userAddress].add(_amount);

    UnlockedCrwdBalance(_userAddress, _amount);
  }

  /**
  * @dev Is balance sufficient for order making/taking
  * @param _isMaker Is the user making or taking an order
  * @param _tokenAddress Token Address
  * @param _orderType Order Type
  * @param _price Price
  * @param _amount Amount
  */
  function isBalanceSufficient(bool _isMaker, address _tokenAddress, OrderType _orderType, uint _price, uint _amount) constant public returns (bool){
    if (_isMaker) {
      if (_orderType == OrderType.BUY) {
        return _price.mul(_amount) <= crwdBalanceOf(msg.sender);
      }
      else {
        return _amount <= tokenBalanceOf(_tokenAddress, msg.sender);
      }
    }
    else {
      if (_orderType == OrderType.SELL) {
        return _price.mul(_amount) <= crwdBalanceOf(msg.sender);
      }
      else {
        return _amount <= tokenBalanceOf(_tokenAddress, msg.sender);
      }
    }
  }

  /**
  * @dev Get number of orders per token
  * @param _tokenAddress Token Address
  */
  function getOrdersLength(address _tokenAddress) constant public returns (uint length){
    return orderIds[_tokenAddress].length;
  }

  /**
  * @dev Get order ids
  * @param _tokenAddress Token Address
  */
  function getOrderIds(address _tokenAddress) public constant returns (uint[])  {
    return orderIds[_tokenAddress];
  }

  /**
  * @dev Get order
  * @param _tokenAddress Token Address
  * @param _id Order id
  */
  function getOrder(address _tokenAddress, uint _id) constant public
  returns (OrderType orderType, uint price, uint amount, address userAddress, bool executed, bool canceled, bool isOrder){
    Order memory order = orders[_tokenAddress][_id];
    return (order.orderType, order.price, order.amount, order.userAddress, order.executed, order.canceled, order.isOrder);
  }

  /**
  * @dev Cancel order
  * @param _tokenAddress Token Address
  * @param _id Order id
  */
  function cancelOrder(address _tokenAddress, uint _id) public {
    Order memory order = orders[_tokenAddress][_id];

    // check order exists and not canceled or executed
    require(order.isOrder && !order.executed && !order.canceled);
    // check order belongs to sender
    require(order.userAddress == msg.sender);

    // unlock balance
    if (order.orderType == OrderType.BUY) {
      unlockCrwdBalance(msg.sender, order.price.mul(order.amount));
    }
    else {
      unlockTokenBalance(msg.sender, _tokenAddress, order.amount);
    }

    // cancel order
    orders[_tokenAddress][_id].canceled = true;

    // Log event
    OrderCanceled(_tokenAddress, _id);
  }

  /**
  * @dev Take order
  * @param _tokenAddress Token Address
  * @param _id Order id
  */
  function takeOrder(address _tokenAddress, uint _id) public {
    Order memory order = orders[_tokenAddress][_id];

    // check order exists and not canceled or executed
    require(order.isOrder && !order.executed && !order.canceled);
    // check order does not belongs to sender
    require(order.userAddress != msg.sender);
    // check verified registry user
    require(registry.isVerifiedAndValid(msg.sender));
    // check balance is sufficient
    require(isBalanceSufficient(false, _tokenAddress, order.orderType, order.price, order.amount));

    address makerAddress = order.userAddress;
    address takerAddress = msg.sender;
    uint dealPrice = order.price * order.amount;

    // take order
    if (order.orderType == OrderType.BUY) {
      // add tokens to the maker's balance
      tokenBalances[_tokenAddress][makerAddress] = tokenBalances[_tokenAddress][makerAddress].add(order.amount);
      // withdraw tokens from the taker's balance
      tokenBalances[_tokenAddress][takerAddress] = tokenBalances[_tokenAddress][takerAddress].sub(order.amount);

      // add crwd to the taker's balance
      crwdBalances[takerAddress] = crwdBalances[takerAddress].add(dealPrice);
      // withdraw crwd from the maker's locked balance
      lockedCrwdBalances[makerAddress] = lockedCrwdBalances[makerAddress].sub(dealPrice);
    }
    else {
      // add tokens to the taker's balance
      tokenBalances[_tokenAddress][takerAddress] = tokenBalances[_tokenAddress][takerAddress].add(order.amount);
      // withdraw tokens from the maker's locked balance
      lockedTokenBalances[_tokenAddress][makerAddress] = lockedTokenBalances[_tokenAddress][makerAddress].sub(order.amount);

      // add crwd to the maker's balance
      crwdBalances[makerAddress] = crwdBalances[makerAddress].add(dealPrice);
      // withdraw crwd from the taker's balance
      crwdBalances[takerAddress] = crwdBalances[takerAddress].sub(dealPrice);
    }

    // make sure balances are still positive
    assert(tokenBalances[_tokenAddress][makerAddress] >= 0);
    assert(lockedTokenBalances[_tokenAddress][makerAddress] >= 0);
    assert(crwdBalances[makerAddress] >= 0);
    assert(lockedCrwdBalances[makerAddress] >= 0);

    assert(lockedTokenBalances[_tokenAddress][takerAddress] >= 0);
    assert(tokenBalances[_tokenAddress][takerAddress] >= 0);
    assert(lockedCrwdBalances[takerAddress] >= 0);
    assert(crwdBalances[takerAddress] >= 0);

    // mark order executed
    orders[_tokenAddress][_id].executed = true;

    // Log event
    OrderTaken(_tokenAddress, _id, msg.sender);
  }

}