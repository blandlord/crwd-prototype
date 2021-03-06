pragma solidity ^0.5.0;


import "./Ownable.sol";


contract Registry is Ownable {
  /*
   *  Events
   */
  event AddressAdded(address indexed userAddress);

  event StateUpdated(address indexed userAddress, State state);

  event NotaryAdded(address indexed notaryaddress, string name, string websiteUrl);

  /*
   *  Storage
   */

  mapping(address => UserData) public usersData;

  address[] public userAddresses;

  enum State {NEW, VERIFIED, EXPIRED, DENIED}

  struct UserData {
    State state;
    string ssn;
    bool isUserData;
  }

  mapping(address => NotaryData) public notariesData;

  address[] public notaryAddresses;

  struct NotaryData {
    string name;
    string websiteUrl;
    bool isNotaryData;
  }

  /*
  * Modifiers
  */

  /**
   * @dev Throws if called by an account that is not a notary address.
   */
  modifier onlyNotary() {
    require(isNotaryAddress(msg.sender));
    _;
  }

  /*
   * Public functions
   */
  /// @dev Contract constructor
  constructor() public {
  }

  /// @dev Allows to add an address to the registry
  /// @param _ssn user social security number
  function addUserAddress(string memory _ssn) public {
    // check ssn not null
    require(bytes(_ssn).length != 0);
    // avoid overwrite
    require(!isUserData(msg.sender));

    // create new entry
    usersData[msg.sender].state = State.NEW;
    usersData[msg.sender].ssn = _ssn;
    usersData[msg.sender].isUserData = true;
    userAddresses.push(msg.sender);

    // Log event
    emit AddressAdded(msg.sender);
  }

  /// @dev Checks if a user address exists
  /// @param _userAddress user address to be checked
  function isUserData(address _userAddress) public view returns (bool) {
    return usersData[_userAddress].isUserData;
  }

  /// @dev Set state on user address
  /// @param _userAddress user address
  /// @param _state new state
  function setState(address _userAddress, uint _state) public onlyNotary {
    // make sure user address exists
    require(isUserData(_userAddress));
    // make sure valid state transition
    require(isValidStateTransition(usersData[_userAddress].state, State(_state)));

    usersData[_userAddress].state = State(_state);

    // Log event
    emit StateUpdated(_userAddress, State(_state));
  }

  /// @dev Checks if a state transition is valid
  /// @param _fromState old state
  /// @param _toState new state
  function isValidStateTransition(State _fromState, State _toState) internal pure returns (bool) {
    if (_fromState == State.NEW && (_toState == State.VERIFIED || _toState == State.DENIED)) {
      return true;
    }

    if (_fromState == State.VERIFIED && (_toState == State.EXPIRED || _toState == State.DENIED)) {
      return true;
    }

    if (_fromState == State.EXPIRED && (_toState == State.VERIFIED)) {
      return true;
    }

    return false;
  }

  /// @dev fetch user addresses
  function getUserAddresses() public view returns (address[] memory)  {
    return userAddresses;
  }

  /// @dev Checks if a user address is verified and valid
  /// @param _userAddress user address to be checked
  function isVerifiedAndValid(address _userAddress) public view returns (bool) {
    return usersData[_userAddress].state == State.VERIFIED;
  }

  /// @dev Allows to add a notary to the registry
  /// @param _name Notary name
  /// @param _websiteUrl Notary website url
  function addNotary(address _address, string memory _name, string memory _websiteUrl) public onlyOwner {
    // check _address not null
    require(_address != address(0));
    // check _name not null
    require(bytes(_name).length != 0);
    // check _websiteUrl not null
    require(bytes(_websiteUrl).length != 0);
    // avoid overwrite
    require(!isNotaryAddress(_address));

    // create new entry
    notariesData[_address].name = _name;
    notariesData[_address].websiteUrl = _websiteUrl;
    notariesData[_address].isNotaryData = true;
    notaryAddresses.push(_address);

    // Log event
    emit NotaryAdded(_address, _name, _websiteUrl);
  }

  /// @dev Checks if a notary address exists
  /// @param _address notary address to be checked
  function isNotaryAddress(address _address) public view returns (bool) {
    return notariesData[_address].isNotaryData;
  }

  /// @dev fetch notary addresses
  function getNotaryAddresses() public view returns (address[] memory)  {
    return notaryAddresses;
  }

}
