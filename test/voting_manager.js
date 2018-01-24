const VotingManager = artifacts.require("./VotingManager.sol");
const CrowdOwned = artifacts.require("./CrowdOwned.sol");
const Registry = artifacts.require("./Registry.sol");
const CrowdOwnedManager = artifacts.require("./CrowdOwnedManager.sol");
const CrowdOwnedExchange = artifacts.require("./CrowdOwnedExchange.sol");

const expectRequireFailure = require('./support/expectRequireFailure');
const proxiedWeb3Handler = require('./support/proxiedWeb3Handler.js');

let STATE = require('./utils/state');


contract('VotingManager', function (accounts) {
  let web3, proxiedWeb3;
  let registryInstance, tokenInstance, crowdOwnedExchangeInstance, votingManagerInstance;

  before(async function beforeTest() {
    web3 = VotingManager.web3;
    proxiedWeb3 = new Proxy(web3, proxiedWeb3Handler);

    registryInstance = await Registry.deployed();
    crowdOwnedExchangeInstance = await CrowdOwnedExchange.deployed();
    votingManagerInstance = await VotingManager.deployed();

    //deploy token
    tokenInstance = await CrowdOwned.new("Example Token", "EXT", "http://example.com/image", accounts[0], registryInstance.address, crowdOwnedExchangeInstance.address, {
      from: accounts[0],
      gas: 3000000
    });

    // add addresses to registry
    await registryInstance.addUserAddress("SSN-1", { from: accounts[1] });
    await registryInstance.addUserAddress("SSN-2", { from: accounts[2] });

    // add account 5 as notary
    await registryInstance.addNotary(accounts[5], "my notary", "notary.example.com", { from: accounts[0] });

    // verify addresses
    await registryInstance.setState(accounts[1], STATE.VERIFIED, { from: accounts[5] });
    await registryInstance.setState(accounts[2], STATE.VERIFIED, { from: accounts[5] });
  });

  describe('create proposal', function () {
    let title = "Proposal Title";
    let description = "Proposal description";
    let duration = 40320;

    it("ok", async function () {
      await votingManagerInstance.createProposal(
        tokenInstance.address,
        title,
        description,
        duration,
        { from: accounts[0], gas: 4000000 });

      let proposalsLength = await votingManagerInstance.getProposalsLength(tokenInstance.address);
      assert.equal(proposalsLength.toNumber(), 1);
    });
  });

});