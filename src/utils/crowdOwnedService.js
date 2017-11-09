import contractService from '../utils/contractService';

async function deployCrowdOwned(web3, newCrowdOwnedContractData) {
  const crowdOwnedManagerInstance = await contractService.getDeployedInstance(web3, "CrowdOwnedManager");

  let results = await crowdOwnedManagerInstance.deployCrowdOwned(newCrowdOwnedContractData.name, newCrowdOwnedContractData.symbol, newCrowdOwnedContractData.imageUrl, {gas: 2000000});
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
  let imageUrl = await crowdOwnedInstance.imageUrl();
  let balance = await crowdOwnedInstance.balanceOf(web3.eth.defaultAccount);

  const crowdOwnedContract = {
    name,
    symbol,
    imageUrl,
    balance: balance.toNumber(),
    address
  };

  return crowdOwnedContract;
}

async function transferTokens(web3, newTokensTransfer) {
  const crowdOwnedInstance = await contractService.getInstanceAt(web3, "CrowdOwned", newTokensTransfer.contractAddress);

  let isValidTransfer = await crowdOwnedInstance.isValidTransfer(newTokensTransfer.to);
  if (!isValidTransfer) {
    throw new Error("Destination address must be verified in the Registry or be the crowd owned contract address");
  }

  let currentBalance = await crowdOwnedInstance.balanceOf(web3.eth.defaultAccount);
  if (newTokensTransfer.amount > currentBalance.toNumber()) {
    throw new Error("Cannot transfer more than the current balance");
  }

  let results = await crowdOwnedInstance.transfer(newTokensTransfer.to, newTokensTransfer.amount, {gas: 80000});
  return results;
}

let crowdOwnedService = {
  deployCrowdOwned: deployCrowdOwned,
  loadCrowdOwnedContracts: loadCrowdOwnedContracts,
  loadCrowdOwnedContract: loadCrowdOwnedContract,
  loadOwnershipData: loadOwnershipData,
  transferTokens: transferTokens,
};

export default crowdOwnedService;