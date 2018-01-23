// Truffle script to init demo data

const Registry = artifacts.require("./Registry.sol");
const CrowdOwnedManager = artifacts.require("./CrowdOwnedManager.sol");

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

  let crowdOwnedContractData = {
    name: "TinyOne, Andijk",
    symbol: "NL1619V001",
    imageUrl: "http://www.jachthavenandijk.nl/wp-content/uploads/2017/09/IMG_8578.jpg",
  };

  const registryInstance = await Registry.deployed();
  const crowdOwnedManagerInstance = await CrowdOwnedManager.deployed();

  // Add notary
  await registryInstance.addNotary(notaryData.address, notaryData.name, notaryData.websiteUrl, {
    from: ownerAddress,
    gas: 400000
  });
  console.log("Notary added");

  let isNotary = await registryInstance.isNotaryAddress(notaryAddress);
  if(isNotary){
    console.log("Notary registered ok");
  }
  else{
    console.log("Notary not registered");
    process.exit(1);
  }

  // deploy crowd owned data
  await crowdOwnedManagerInstance.deployCrowdOwned(crowdOwnedContractData.name, crowdOwnedContractData.symbol, crowdOwnedContractData.imageUrl, {
    from: notaryAddress,
    gas: 4000000
  });
  console.log("CrowOwned contract deployed");
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
