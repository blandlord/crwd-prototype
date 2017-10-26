pragma solidity ^0.4.15;


contract Registry {
    /*
     *  Events
     */
    event AddressAdded(address indexed userAddress);

    /*
     *  Storage
     */

    mapping (address => UserData) public userDataStore;
    address[] public userAddresses;

    enum State {NEW, VERIFIED, LOCKED}

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
    function addUserAddress(address _userAddress) public{
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
    function isUserData(address _userAddress) public constant returns(bool) {
        return userDataStore[_userAddress].isUserData;
    }

}
