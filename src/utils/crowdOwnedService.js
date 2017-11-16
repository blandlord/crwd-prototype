import contractService from '../utils/contractService';

const promisify = require("promisify-es6");

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

    let code = await promisify(web3.eth.getCode)(contractAddress);
    if (code === "0x0") {
      // contract was killed
      continue;
    }

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

async function populateContractsData(web3, crowdOwnedContracts) {

  for (let i = 0; i < crowdOwnedContracts.length; i++) {
    let crowdOwnedContractData = crowdOwnedContracts[i];

    const crowdOwnedInstance = await contractService.getInstanceAt(web3, "CrowdOwned", crowdOwnedContractData.address);

    let balance = await crowdOwnedInstance.balanceOf(web3.eth.defaultAccount);
    let imageUrl = await crowdOwnedInstance.imageUrl();
    crowdOwnedContractData.balance = balance.toNumber();
    crowdOwnedContractData.imageUrl = imageUrl;
  }

  return crowdOwnedContracts;
}

async function loadCrowdOwnedContract(web3, address) {
  const crowdOwnedInstance = await contractService.getInstanceAt(web3, "CrowdOwned", address);
  const crwdTokenInstance = await contractService.getDeployedInstance(web3, "CRWDToken");

  let name = await crowdOwnedInstance.name();
  let symbol = await crowdOwnedInstance.symbol();
  let imageUrl = await crowdOwnedInstance.imageUrl();
  let ownerAddress = await crowdOwnedInstance.owner();
  let balance = await crowdOwnedInstance.balanceOf(web3.eth.defaultAccount);
  let contractBalance = await crowdOwnedInstance.balanceOf(crowdOwnedInstance.address);
  let contractEthBalance = await promisify(web3.eth.getBalance)(crowdOwnedInstance.address);
  let totalSupply = await crowdOwnedInstance.totalSupply();
  let circulatingSupply = await crowdOwnedInstance.circulatingSupply();

  let contractCRWDBalance = await crwdTokenInstance.balanceOf(crowdOwnedInstance.address);

  let lastValuation = await crowdOwnedInstance.getValuation(0);
  let lastValuationBlock = await promisify(web3.eth.getBlock)(lastValuation[0].toNumber());
  let lastValuationDate = new Date(lastValuationBlock.timestamp * 1000);


  const crowdOwnedContract = {
    address,
    name,
    symbol,
    imageUrl,
    ownerAddress,
    balance: balance.toNumber(),
    contractBalance: contractBalance.toNumber(),
    contractEthBalance: web3.fromWei(contractEthBalance.toNumber(), "ether"),
    contractCRWDBalance: contractCRWDBalance.toNumber(),
    totalSupply: totalSupply.toNumber(),
    circulatingSupply: circulatingSupply.toNumber(),
    lastValuation: {
      date: lastValuationDate,
      blockheight: lastValuation[0],
      currency: web3.toAscii(lastValuation[1]).replace(/\u0000/g, ""),
      value: lastValuation[2],
      isValuation: lastValuation[3]
    },
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

  let results = await crowdOwnedInstance.transfer(newTokensTransfer.to, newTokensTransfer.amount, {gas: 120000});
  return results;
}

async function getOwnersData(web3, address) {
  const crowdOwnedInstance = await contractService.getInstanceAt(web3, "CrowdOwned", address);

  let ownerAddresses = await crowdOwnedInstance.getOwnerAddresses();

  let ownersData = [];
  for (let i = 0; i < ownerAddresses.length; i++) {
    let balance = await crowdOwnedInstance.balanceOf(ownerAddresses[i]);
    ownersData.push({balance: balance.toNumber(), address: ownerAddresses[i]});
  }
  return ownersData;
}


async function killCrowdOwnedContract(web3, contractAddress) {
  const crowdOwnedInstance = await contractService.getInstanceAt(web3, "CrowdOwned", contractAddress);
  const crwdTokenInstance = await contractService.getDeployedInstance(web3, "CRWDToken");

  let results = await crowdOwnedInstance.kill(crwdTokenInstance.address, {gas: 200000});
  return results;
}

let crowdOwnedService = {
  deployCrowdOwned: deployCrowdOwned,
  loadCrowdOwnedContracts: loadCrowdOwnedContracts,
  loadCrowdOwnedContract: loadCrowdOwnedContract,
  populateContractsData: populateContractsData,
  transferTokens: transferTokens,
  getOwnersData,
  killCrowdOwnedContract
};

export default crowdOwnedService;