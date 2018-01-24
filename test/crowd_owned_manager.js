const CrowdOwned = artifacts.require("./CrowdOwned.sol");
const Registry = artifacts.require("./Registry.sol");
const CRWDToken = artifacts.require("./CRWDToken.sol");
const CrowdOwnedExchange = artifacts.require("./CrowdOwnedExchange.sol");
const CrowdOwnedManager = artifacts.require("./CrowdOwnedManager.sol");

const expectRequireFailure = require('./support/expectRequireFailure');
const proxiedWeb3Handler = require('./support/proxiedWeb3Handler.js');

contract('CrowdOwnedManager', function (accounts) {
  let web3, proxiedWeb3;
  let registryInstance, crwdTokenInstance, crowdOwnedManagerInstance, crowdOwnedExchangeInstance,crowdOwnedInstance;

  before(async function beforeTest() {
    web3 = CrowdOwned.web3;
    proxiedWeb3 = new Proxy(web3, proxiedWeb3Handler);

    registryInstance = await Registry.deployed();
    crwdTokenInstance = await CRWDToken.deployed();
    crowdOwnedExchangeInstance = await CrowdOwnedExchange.deployed();
    crowdOwnedManagerInstance = await CrowdOwnedManager.deployed();
  });

  describe('new', function newTest() {

    it('registry set ok', async function it() {
      let registryAddress = await crowdOwnedManagerInstance.registry();

      assert.equal(registryAddress, registryInstance.address);
    });

    it('crwdToken set ok', async function it() {
      let crwdTokenAddress = await crowdOwnedManagerInstance.crwdToken();

      assert.equal(crwdTokenAddress, crwdTokenInstance.address);
    });

    it('crowdOwnedExchange set ok', async function it() {
      let crowdOwnedExchangeAddress = await crowdOwnedManagerInstance.crowdOwnedExchange();

      assert.equal(crowdOwnedExchangeAddress, crowdOwnedExchangeInstance.address);
    });

  });

  describe('deployCrowdOwned', function () {
    before(async function beforeTest() {
      // add account 5 as notary
      await registryInstance.addNotary(accounts[5], "my notary", "notary.example.com", {from: accounts[0]});
    });

    context('not notary', function () {
      it("cannot deploy", async function () {
        await expectRequireFailure(() => crowdOwnedManagerInstance.deployCrowdOwned("Token A", "TOKA", "http://example.com/image", {from: accounts[0]}));
      });
    });

    it("deploys CrowdOwned contract and saves data in CrowdOwnedManager", async function () {
      let results = await crowdOwnedManagerInstance.deployCrowdOwned("Token A", "TOKA", "http://example.com/image", {from: accounts[5]});

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
      assert.equal(owner, accounts[5]);
      let registryAddress = await crowdOwnedInstance.registry();
      assert.equal(registryAddress, registryInstance.address);
      let crowdOwnedExchangeAddress = await crowdOwnedInstance.crowdOwnedExchange();
      assert.equal(crowdOwnedExchangeAddress, crowdOwnedExchangeInstance.address);
      let balanceOfOwner = await crowdOwnedInstance.balanceOf(accounts[5]);
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