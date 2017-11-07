import CrowdOwnedManagerContract from '../../build/contracts/CrowdOwnedManager.json'

const contract = require('truffle-contract');

async function deployCrowdOwned(web3, newCrowdOwnedContractData) {
  const crowdOwnedManagerContract = contract(CrowdOwnedManagerContract);
  crowdOwnedManagerContract.setProvider(web3.currentProvider);
  const instance = await crowdOwnedManagerContract.deployed();

  let results = await instance.deployCrowdOwned(newCrowdOwnedContractData.name, newCrowdOwnedContractData.symbol, {gas: 2000000});
  return results;
}

async function loadCrowdOwnedContracts(web3) {
  const crowdOwnedManagerContract = contract(CrowdOwnedManagerContract);
  crowdOwnedManagerContract.setProvider(web3.currentProvider);

  const crowdOwnedManagerInstance = await crowdOwnedManagerContract.deployed();

  let contractsAddresses = await crowdOwnedManagerInstance.getContractsAddresses();

  const crowdOwnedContracts = [];

  for (let i = 0; i < contractsAddresses.length; i++) {
    let contractAddress = contractsAddresses[i];
    const values = await crowdOwnedManagerInstance.contractsData(contractAddress);
    let isContractData = values[2]; // make sure value exists
    if (isContractData) {
      crowdOwnedContracts.push({
        name: values[0],
        symbol: values[1],
        address: contractAddress,
      });
    }
  }

  return crowdOwnedContracts;
}


let crowdOwnedService = {
  deployCrowdOwned: deployCrowdOwned,
  loadCrowdOwnedContracts: loadCrowdOwnedContracts,
};

export default crowdOwnedService;