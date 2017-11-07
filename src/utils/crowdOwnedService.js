import contractService from '../utils/contractService';

async function deployCrowdOwned(web3, newCrowdOwnedContractData) {
  const crowdOwnedManagerInstance = await contractService.getDeployedInstance(web3, "CrowdOwnedManager");

  let results = await crowdOwnedManagerInstance.deployCrowdOwned(newCrowdOwnedContractData.name, newCrowdOwnedContractData.symbol, {gas: 2000000});
  return results;
}

async function loadCrowdOwnedContracts(web3) {
  const crowdOwnedManagerInstance = await contractService.getDeployedInstance(web3, "CrowdOwnedManager");

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

async function loadOwnershipData(web3, crowdOwnedContracts) {

  for (let i = 0; i < crowdOwnedContracts.length; i++) {
    let crowdOwnedContractData = crowdOwnedContracts[i];
    const crowdOwnedInstance = await contractService.getInstanceAt(web3, "CrowdOwned", crowdOwnedContractData.address);
    let balance = await crowdOwnedInstance.balanceOf(web3.eth.defaultAccount);
    crowdOwnedContractData.balance = balance.toNumber();
  }

  return crowdOwnedContracts;
}

async function loadCrowdOwnedContract(web3, address) {
  const crowdOwnedInstance = await contractService.getInstanceAt(web3, "CrowdOwned", address);

  let name = await crowdOwnedInstance.name();
  let symbol = await crowdOwnedInstance.symbol();
  let balance = await crowdOwnedInstance.balanceOf(web3.eth.defaultAccount);

  const crowdOwnedContract = {
    name,
    symbol,
    balance: balance.toNumber(),
    address
  };

  return crowdOwnedContract;
}


let crowdOwnedService = {
  deployCrowdOwned: deployCrowdOwned,
  loadCrowdOwnedContracts: loadCrowdOwnedContracts,
  loadCrowdOwnedContract: loadCrowdOwnedContract,
  loadOwnershipData: loadOwnershipData,
};

export default crowdOwnedService;