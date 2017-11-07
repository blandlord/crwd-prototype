import contractService from '../utils/contractService';


async function addUserAddress(web3, newUserData) {
  const instance = await contractService.getDeployedInstance(web3, "Registry");

  let results = await instance.addUserAddress(newUserData.userAddress, newUserData.ssn, {gas: 400000});
  return results;
}

async function loadUsersData(web3) {
  const instance = await contractService.getDeployedInstance(web3, "Registry");

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
  const instance = await contractService.getDeployedInstance(web3, "Registry");

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
  const instance = await contractService.getDeployedInstance(web3, "Registry");

  const ownerAddress = await instance.owner();
  return ownerAddress;
}

async function setState(web3, userAddress, state) {
  const instance = await contractService.getDeployedInstance(web3, "Registry");

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