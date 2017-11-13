const CrowdOwnedManager = artifacts.require("./CrowdOwnedManager.sol");
const CrowdOwned = artifacts.require("./CrowdOwned.sol");
const Registry = artifacts.require("./Registry.sol");
const CRWDToken = artifacts.require("./CRWDToken.sol");

contract('CrowdOwnedManager', function (accounts) {

  let registryInstance, crwdTokenInstance,crowdOwnedManagerInstance;

  before(async function beforeTest() {
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

      let tokenInstance = await CrowdOwned.at(loggedTokenAddress);

      let name = await tokenInstance.name();
      assert.equal(name, "Token A");
      let symbol = await tokenInstance.symbol();
      assert.equal(symbol, "TOKA");
      let imageUrl = await tokenInstance.imageUrl();
      assert.equal(imageUrl,  "http://example.com/image");
      let owner = await tokenInstance.owner();
      assert.equal(owner, accounts[0]);
      let registryAddress = await tokenInstance.registry();
      assert.equal(registryAddress, registryInstance.address);
      let balanceOfOwner = await tokenInstance.balanceOf(accounts[0]);
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