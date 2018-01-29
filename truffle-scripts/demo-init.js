// Truffle script to init demo data


const Registry = artifacts.require("./Registry.sol");
const CrowdOwned = artifacts.require("./CrowdOwned.sol");
const CrowdOwnedManager = artifacts.require("./CrowdOwnedManager.sol");
const VotingManager = artifacts.require("./VotingManager.sol");
let STATE = require('../test/utils/state');

async function run() {
  const web3 = Registry.web3;
  const accounts = web3.eth.accounts;

  let ownerAddress = accounts[0];
  let notaryAddress = accounts[1];

  let notaryData = {
    address: notaryAddress,
    name: "Demo Notary",
    websiteUrl: "http://demo-notary.example.com",
  };

  let crowdOwnedContractsData = [{
    name: "TinyOne, Andijk",
    symbol: "NL1619V001",
    imageUrl: "http://www.jachthavenandijk.nl/wp-content/uploads/2017/09/IMG_8578.jpg",
  }, {
    name: "Schieweg, Rotterdam Noord",
    symbol: "NL3038A001",
    imageUrl: "http://www.mevrouwdeaankoopmakelaar.nl/Rotterdam/wp-content/uploads/2014/05/foto-succesvol-aangekocht.jpg",
  }];

  const registryInstance = await Registry.deployed();
  const crowdOwnedManagerInstance = await CrowdOwnedManager.deployed();
  const votingManagerInstance = await VotingManager.deployed();

  // Add notary
  await registryInstance.addNotary(notaryData.address, notaryData.name, notaryData.websiteUrl, {
    from: ownerAddress,
    gas: 400000
  });
  console.log("Notary added: " + notaryData.address);

  let isNotary = await registryInstance.isNotaryAddress(notaryAddress);
  if (isNotary) {
    console.log("Notary registered ok: " + notaryData.name);
  }
  else {
    console.log("Notary not registered");
    process.exit(1);
  }

  // add addresses
  console.log("Adding user addresses to registry ...");
  await registryInstance.addUserAddress("NL-1", { from: ownerAddress });
  await registryInstance.addUserAddress("NL-2", { from: notaryAddress });

  // verify addresses
  console.log("verifying addresses ...");
  await registryInstance.setState(ownerAddress, STATE.VERIFIED, { from: notaryAddress });
  await registryInstance.setState(notaryAddress, STATE.VERIFIED, { from: notaryAddress });

  // deploy crowd owned data
  for (let i = 0; i < crowdOwnedContractsData.length; i++) {
    let contractData = crowdOwnedContractsData[i];

    let results = await crowdOwnedManagerInstance.deployCrowdOwned(contractData.name, contractData.symbol, contractData.imageUrl, {
      from: notaryAddress,
      gas: 4000000
    });

    console.log(`CrowdOwned contract deployed: ${contractData.symbol}`);
  }

  // get crowd owned addresses
  let contractsAddresses = await crowdOwnedManagerInstance.getContractsAddresses();

  let crowdOwnedInstance_0 = await CrowdOwned.at(contractsAddresses[0]);
  let crowdOwnedInstance_1 = await CrowdOwned.at(contractsAddresses[1]);

  // save valuations
  console.log("saving valuations ...");
  await crowdOwnedInstance_0.saveValuation(1, "EUR", 100000, {
    from: notaryAddress,
    gas: 200000
  });
  await crowdOwnedInstance_1.saveValuation(1, "EUR", 100000, {
    from: notaryAddress,
    gas: 200000
  });

  // transfer tokens to admin before creating proposal 1
  console.log("transferring object#1 tokens to admin ...");
  await crowdOwnedInstance_0.transfer(ownerAddress, 45000, { from: notaryAddress });

  // create proposal
  console.log("creating proposal for object#1 ...");
  await votingManagerInstance.createProposal(
    crowdOwnedInstance_0.address,
    "Renew kitchen for 8000 euro",
    "Proposal to renew kitchen for 8000 euro ...",
    604800, // a week  in seconds
    { from: notaryAddress, gas: 4000000 });
}

module.exports = function (callback) {
  try {
    run().then(() => {
      callback();
    })
  }
  catch (err) {
    callback(err);
  }
};
