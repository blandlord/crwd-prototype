pragma solidity ^0.5.0;


import './StandardToken.sol';
import './Ownable.sol';
import './Registry.sol';
import './CrowdOwnedManager.sol';
import './CrowdOwnedExchange.sol';
import './CRWDToken.sol';


contract CrowdOwned is StandardToken, Ownable {
  /*
   *  Events
   */
  event ValuationSaved(uint indexed _blockheight, bytes32 _currency, uint _value);

  event ValuationDeleted(uint indexed _blockheight);

  event EthPaymentReceived(address indexed _sender, uint _blockheight, uint _value);

  /*
   * Storage
   */
  Registry public registry;

  CrowdOwnedExchange public crowdOwnedExchange;

  string public  name;

  string public  symbol;

  string public  imageUrl;

  mapping(address => bool) ownerAddressInitialized;

  address[] public ownerAddresses;

  mapping(uint => Valuation) public valuationsData;

  uint[] public valuationBlockheights;

  struct Valuation {
    bytes32 currency;
    uint value;
    bool isValuation;
  }


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
  constructor(string memory _name, string memory _symbol, string memory _imageUrl, address _owner, Registry _registry, CrowdOwnedExchange _crowdOwnedExchange) public {
    // prevent setting to null
    require(address(_registry) != address(0));
    require(address(_crowdOwnedExchange) != address(0));
    require(address(_owner) != address(0));

    name = _name;
    symbol = _symbol;
    imageUrl = _imageUrl;

    // override Ownable constructor to allow indirect deployment
    owner = _owner;

    // set registry
    registry = _registry;

    // set exchange
    crowdOwnedExchange = _crowdOwnedExchange;

    totalSupply_ = INITIAL_SUPPLY;
    balances[_owner] = INITIAL_SUPPLY;

    // add owner to list
    tryAddOwnerAddress(_owner);
  }

  /**
  * @dev set registry contract address
  * @param _registry Registry contract address
  */
  function setRegistry(Registry _registry) public onlyOwner {
    // prevent setting to null
    require(address(_registry) != address(0));

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
  function isValidTransfer(address _to) public view returns (bool){
    return (_to == address(this) || _to == address(crowdOwnedExchange) || registry.isVerifiedAndValid(_to));
  }

  /**
  * @dev get tokens circulating supply
  */
  function circulatingSupply() public view returns (uint) {
    return totalSupply() - balanceOf(address(this));
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
  function getOwnerAddresses() public view returns (address[] memory) {
    return ownerAddresses;
  }

  /**
  * @dev get owner addresses length
  */
  function getOwnerAddressesLength() public view returns (uint) {
    return ownerAddresses.length;
  }

  /**
  * @dev Save valuation
  * @param _blockheight valuation blockheight
  * @param _currency valuation currency
  * @param _value valuation value
  */
  function saveValuation(uint _blockheight, bytes32 _currency, uint _value) public onlyOwner {
    // make sure blockheight after last valuation blockheight
    require(_blockheight > getLastValuationBlockheight());

    // create new valuation
    valuationsData[_blockheight].currency = _currency;
    valuationsData[_blockheight].value = _value;
    valuationsData[_blockheight].isValuation = true;
    valuationBlockheights.push(_blockheight);

    // Log event
    emit ValuationSaved(_blockheight, _currency, _value);
  }

  /**
  * @dev Get last valuation blockheight
  */
  function getLastValuationBlockheight() public view returns (uint){
    if (valuationBlockheights.length == 0) {
      // no data
      return 0;
    }

    // find last blockheight whose valuation data was not deleted
    for (uint i = valuationBlockheights.length - 1; i >= 0; i--)
    {
      uint blockheight = valuationBlockheights[i];
      if (valuationsData[blockheight].isValuation) {
        return blockheight;
      }
    }
  }

  /**
  * @dev Delete valuation
  * @param _blockheight valuation blockheight
  */
  function deleteValuation(uint _blockheight) public onlyOwner {
    delete valuationsData[_blockheight];

    // Log event
    emit ValuationDeleted(_blockheight);
  }

  /**
  * @dev Get Valuation
  * @param _blockheight valuation blockheight
  */
  function getValuation(uint _blockheight) public view returns (uint, bytes32, uint, bool){
    // calling with 0 returns the last valuation data
    uint blockheight = (_blockheight > 0 ? _blockheight : getLastValuationBlockheight());
    return (blockheight, valuationsData[blockheight].currency, valuationsData[blockheight].value, valuationsData[blockheight].isValuation);
  }

  /**
  * @dev Kills contract
  * @param _crwdToken token address
  */
  function kill(CRWDToken _crwdToken) public onlyOwner {
    // Transfer CRWD Tokens balance to owner
    _crwdToken.transfer(owner, _crwdToken.balanceOf(address(this)));

    // kill contract and send ETH balance to owner
    address payable ownerPayable = address(uint160(owner));
    selfdestruct(ownerPayable);
  }

  /**
  * @dev Fallback function to receive funds
  */
  function() external payable {
    // Log event
    emit EthPaymentReceived(msg.sender, block.number, msg.value);
  }

}