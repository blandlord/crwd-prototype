const CrowdOwnedManager = artifacts.require("./CrowdOwnedManager.sol");
const CrowdOwned = artifacts.require("./CrowdOwned.sol");
const Registry = artifacts.require("./Registry.sol");
const CRWDToken = artifacts.require("./CRWDToken.sol");

const proxiedWeb3Handler = require('./support/proxiedWeb3Handler.js');

contract('CrowdOwnedManager', function (accounts) {

  let web3, proxiedWeb3;
  let registryInstance, crwdTokenInstance, crowdOwnedManagerInstance, crowdOwnedInstance;

  before(async function beforeTest() {
    web3 = CrowdOwned.web3;
    proxiedWeb3 = new Proxy(web3, proxiedWeb3Handler);

    registryInstance = await Registry.deployed();
    crwdTokenInstance = await CRWDToken.deployed();
    crowdOwnedManagerInstance = await CrowdOwnedManager.deployed();
  });

  describe('new', function newTest() {

    it('registry set ok', async function it() {
      let registryAddress = await crowdOwnedManagerInstance.registry();

      assert.equal(registryAddress, registryInstance.address);
    });

    it('CRWDToken set ok', async function it() {
      let crwdTokenAddress = await crowdOwnedManagerInstance.crwdToken();

      assert.equal(crwdTokenAddress, crwdTokenInstance.address);
    });

  });

  describe('deployCrowdOwned', function () {
    it("deploys CrowdOwned contract and saves data in CrowdOwnedManager", async function () {
      let results = await crowdOwnedManagerInstance.deployCrowdOwned("Token A", "TOKA", "http://example.com/image");

      let log = results.logs[0];
      let loggedTokenAddress = log.args.contractAddress;

      crowdOwnedInstance = await CrowdOwned.at(loggedTokenAddress);

      let name = await crowdOwnedInstance.name();
      assert.equal(name, "Token A");
      let symbol = await crowdOwnedInstance.symbol();
      assert.equal(symbol, "TOKA");
      let imageUrl = await crowdOwnedInstance.imageUrl();
      assert.equal(imageUrl, "http://example.com/image");
      let owner = await crowdOwnedInstance.owner();
      assert.equal(owner, accounts[0]);
      let registryAddress = await crowdOwnedInstance.registry();
      assert.equal(registryAddress, registryInstance.address);
      let balanceOfOwner = await crowdOwnedInstance.balanceOf(accounts[0]);
      assert.equal(balanceOfOwner.toNumber(), 100000);

      let contractsAddresses = await crowdOwnedManagerInstance.getContractsAddresses();
      assert.equal(contractsAddresses[0], loggedTokenAddress);

      let contractData = await crowdOwnedManagerInstance.contractsData(loggedTokenAddress);

      assert.equal(contractData[0], name);
      assert.equal(contractData[1], symbol);
      assert.equal(contractData[2], true);
    });
  });

});