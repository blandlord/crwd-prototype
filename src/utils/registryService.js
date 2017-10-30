import RegistryContract from '../../build/contracts/Registry.json'

const contract = require('truffle-contract');

async function addUserAddress(web3, newUserData) {
  const registryContract = contract(RegistryContract);
  registryContract.setProvider(web3.currentProvider);
  const instance = await registryContract.deployed();

  let results = await instance.addUserAddress(newUserData.userAddress, newUserData.ssn, {gas: 400000});
  return results;
}

async function loadUsersData(web3) {
  const registryContract = contract(RegistryContract);
  registryContract.setProvider(web3.currentProvider);

  const instance = await registryContract.deployed();

  let userAddresses = await instance.getUserAddresses();

  const usersData = [];

  for (let i = 0; i < userAddresses.length; i++) {
    let userAddress = userAddresses[i];
    const values = await instance.usersData(userAddress);
    let isUserData = values[2]; // make sure value exists
    if (isUserData) {
      usersData.push({
        state: values[0].toNumber(),
        ssn: values[1],
        userAddress: userAddress,
      });
    }
  }

  return usersData;
}

async function loadCurrentUserData(web3) {
  const registryContract = contract(RegistryContract);
  registryContract.setProvider(web3.currentProvider);

  const instance = await registryContract.deployed();

  const values = await instance.usersData(web3.eth.defaultAccount);

  let currentUserData = {
    state: values[0].toNumber(),
    ssn: values[1],
    isUserData: values[2],
    userAddress: web3.eth.defaultAccount
  };

  return currentUserData;
}

async function loadOwnerAddress(web3) {
  const registryContract = contract(RegistryContract);
  registryContract.setProvider(web3.currentProvider);

  const instance = await registryContract.deployed();

  const ownerAddress = await instance.owner();
  return ownerAddress;
}

async function setState(web3, userAddress, state) {
  const registryContract = contract(RegistryContract);
  registryContract.setProvider(web3.currentProvider);
  const instance = await registryContract.deployed();

  let results = await instance.setState(userAddress, state, {gas: 400000});

  return results;
}

let registryService = {
  addUserAddress: addUserAddress,
  loadUsersData: loadUsersData,
  loadCurrentUserData: loadCurrentUserData,
  loadOwnerAddress: loadOwnerAddress,
  setState: setState,
};

export default registryService;