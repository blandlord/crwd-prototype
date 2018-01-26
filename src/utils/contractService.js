const truffleContract = require('truffle-contract');

const CrowdOwned = require('../../build/contracts/CrowdOwned.json');
const CrowdOwnedExchange = require('../../build/contracts/CrowdOwnedExchange.json');
const CrowdOwnedManager = require('../../build/contracts/CrowdOwnedManager.json');
const CRWDToken = require('../../build/contracts/CRWDToken.json');
const Registry = require('../../build/contracts/Registry.json');
const VotingManager = require('../../build/contracts/VotingManager.json');

const contracts = {
  CrowdOwned,
  CrowdOwnedExchange,
  CrowdOwnedManager,
  CRWDToken,
  Registry,
  VotingManager,
};

const deployedInstances = {};

async function getDeployedInstance(web3, contractName) {
  if (deployedInstances[contractName]) {
    return deployedInstances[contractName];
  }

  const contract = truffleContract(contracts[contractName]);
  contract.setProvider(web3.currentProvider);
  const instance = await contract.deployed();

  deployedInstances[contractName] = instance;

  return instance;
}

async function getInstanceAt(web3, contractName, address) {
  const contract = truffleContract(contracts[contractName]);
  contract.setProvider(web3.currentProvider);
  const instance = await contract.at(address);

  return instance;
}

let contractService = {
  getDeployedInstance: getDeployedInstance,
  getInstanceAt: getInstanceAt,
};

if (process.env.NODE_ENV === "development") {
  // assign to window vars for debugging
  window.debugVars = {contractService: contractService};
}

export default contractService;