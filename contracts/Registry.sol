pragma solidity ^0.4.15;


import "./Ownable.sol";


contract Registry is Ownable {
    /*
     *  Events
     */
    event AddressAdded(address indexed userAddress);

    event StateUpdated(address indexed userAddress, State state);

    /*
     *  Storage
     */

    mapping (address => UserData) public userDataStore;

    address[] public userAddresses;

    enum State {NEW, VERIFIED, EXPIRED}

    struct UserData {
    State state;
    bool isUserData;
    }

    /*
     * Public functions
     */
    /// @dev Contract constructor
    function Registry() {
    }

    /// @dev Allows to add an address to the registry
    /// @param _userAddress user address to be added
    function addUserAddress(address _userAddress) public {
        // check user address not null
        require(_userAddress != address(0));
        // avoid overwrite
        require(!isUserData(_userAddress));

        // create new entry
        userDataStore[_userAddress].state = State.NEW;
        userDataStore[_userAddress].isUserData = true;
        userAddresses.push(_userAddress);

        // Log event
        AddressAdded(_userAddress);
    }

    /// @dev Checks if a user address exists
    /// @param _userAddress user address to be checked
    function isUserData(address _userAddress) public constant returns (bool) {
        return userDataStore[_userAddress].isUserData;
    }

    /// @dev Set state on user address
    /// @param _userAddress user address
    /// @param _state new state
    function setState(address _userAddress, uint _state) public onlyOwner {
        // check new state is valid
        require(_state <= uint(State.EXPIRED));
        // make sure user address exists
        require(isUserData(_userAddress));

        userDataStore[_userAddress].state = State(_state);

        // Log event
        StateUpdated(_userAddress, State(_state));
    }

}
