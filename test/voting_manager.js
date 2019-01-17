const _ = require("lodash");
const promisify = require("promisify-es6");

const VotingManager = artifacts.require("./VotingManager.sol");
const CrowdOwned = artifacts.require("./CrowdOwned.sol");
const Registry = artifacts.require("./Registry.sol");
const CrowdOwnedManager = artifacts.require("./CrowdOwnedManager.sol");
const CrowdOwnedExchange = artifacts.require("./CrowdOwnedExchange.sol");

const expectRequireFailure = require('./support/expectRequireFailure');
const proxiedWeb3Handler = require('./support/proxiedWeb3Handler.js');

let STATE = require('./utils/state');
let VOTE_CHOICE = require('./utils/voteChoice');


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
      gas: 4000000
    });

    // add addresses to registry
    await registryInstance.addUserAddress("SSN-1", { from: accounts[1] });
    await registryInstance.addUserAddress("SSN-2", { from: accounts[2] });
    await registryInstance.addUserAddress("SSN-3", { from: accounts[3] });

    // add account 5 as notary
    await registryInstance.addNotary(accounts[5], "my notary", "notary.example.com", { from: accounts[0] });

    // verify addresses
    await registryInstance.setState(accounts[1], STATE.VERIFIED, { from: accounts[5] });
    await registryInstance.setState(accounts[2], STATE.VERIFIED, { from: accounts[5] });
    await registryInstance.setState(accounts[3], STATE.VERIFIED, { from: accounts[5] });

    await tokenInstance.transfer(accounts[1], 10000, { from: accounts[0] });
    await tokenInstance.transfer(accounts[2], 20000, { from: accounts[0] });
    await tokenInstance.transfer(accounts[3], 15000, { from: accounts[0] });
  });

  describe('create proposal', function () {
    let title = "Proposal 1 Title";
    let description = "Proposal 1 description";
    let duration = 604800; // a week  in seconds

    it("ok", async function () {
      let results = await votingManagerInstance.createProposal(
        tokenInstance.address,
        title,
        description,
        duration,
        { from: accounts[0], gas: 4000000 });

      let log = results.logs[0];
      let block = await promisify(web3.eth.getBlock)(log.blockNumber);

      let proposalsLength = await votingManagerInstance.getProposalsLength(tokenInstance.address);
      assert.equal(proposalsLength.toNumber(), 1);

      let proposalData = await votingManagerInstance.getProposal(tokenInstance.address, 1);
      assert.equal(proposalData[0], accounts[0]);
      assert.equal(proposalData[1], title);
      assert.equal(proposalData[2], description);
      assert.equal(proposalData[3].toNumber(), block.timestamp * 1000);
      assert.equal(proposalData[4].toNumber(), (block.timestamp + duration) * 1000);
      assert.equal(proposalData[5].toNumber(), 100000);
      assert.equal(proposalData[6], 0);
      assert.equal(proposalData[7], 0);
      assert.equal(proposalData[8], 0);
      assert.equal(proposalData[9], true);

      let tokensOwned_0 = await votingManagerInstance.getProposalTokensOwned(tokenInstance.address, 1, accounts[0]);
      assert.equal(tokensOwned_0.toNumber(), 55000);

      let tokensOwned_1 = await votingManagerInstance.getProposalTokensOwned(tokenInstance.address, 1, accounts[1]);
      assert.equal(tokensOwned_1.toNumber(), 10000);

      let tokensOwned_2 = await votingManagerInstance.getProposalTokensOwned(tokenInstance.address, 1, accounts[2]);
      assert.equal(tokensOwned_2.toNumber(), 20000);

      let tokensOwned_3 = await votingManagerInstance.getProposalTokensOwned(tokenInstance.address, 1, accounts[3]);
      assert.equal(tokensOwned_3.toNumber(), 15000);
    });
  });

  describe('vote', function () {

    it("user 0 votes", async function () {
      let results = await votingManagerInstance.vote(tokenInstance.address, 1, VOTE_CHOICE.YES, {
        from: accounts[0],
        gas: 4000000
      });

      let hasVoted_0 = await votingManagerInstance.hasVoted(tokenInstance.address, 1, accounts[0]);
      assert.equal(hasVoted_0, true);

      let vote_0 = await votingManagerInstance.getMyVote(tokenInstance.address, 1, { from: accounts[0] });
      assert.equal(_.invert(VOTE_CHOICE)[vote_0.toNumber()], "YES");

      let proposalData = await votingManagerInstance.getProposal(tokenInstance.address, 1);
      assert.equal(proposalData[6].toNumber(), 55000);
      assert.equal(proposalData[7].toNumber(), 0);
      assert.equal(proposalData[8].toNumber(), 0);
      assert.equal(proposalData[9], true);
    });

    it("no double vote", async function () {
      await expectRequireFailure(() => votingManagerInstance.vote(tokenInstance.address, 1, VOTE_CHOICE.YES, {
        from: accounts[0],
        gas: 4000000
      }));
    });

    it("other users vote", async function () {
      await votingManagerInstance.vote(tokenInstance.address, 1, VOTE_CHOICE.NO, {
        from: accounts[1],
        gas: 4000000
      });

      await votingManagerInstance.vote(tokenInstance.address, 1, VOTE_CHOICE.NO, {
        from: accounts[2],
        gas: 4000000
      });

      await votingManagerInstance.vote(tokenInstance.address, 1, VOTE_CHOICE.ABSTAIN, {
        from: accounts[3],
        gas: 4000000
      });


      let hasVoted_1 = await votingManagerInstance.hasVoted(tokenInstance.address, 1, accounts[1]);
      assert.equal(hasVoted_1, true);
      let vote_1 = await votingManagerInstance.getMyVote(tokenInstance.address, 1, { from: accounts[1] });
      assert.equal(_.invert(VOTE_CHOICE)[vote_1.toNumber()], "NO");

      let hasVoted_2 = await votingManagerInstance.hasVoted(tokenInstance.address, 1, accounts[2]);
      assert.equal(hasVoted_2, true);
      let vote_2 = await votingManagerInstance.getMyVote(tokenInstance.address, 1, { from: accounts[2] });
      assert.equal(_.invert(VOTE_CHOICE)[vote_2.toNumber()], "NO");

      let hasVoted_3 = await votingManagerInstance.hasVoted(tokenInstance.address, 1, accounts[3]);
      assert.equal(hasVoted_3, true);
      let vote_3 = await votingManagerInstance.getMyVote(tokenInstance.address, 1, { from: accounts[3] });
      assert.equal(_.invert(VOTE_CHOICE)[vote_3.toNumber()], "ABSTAIN");

      let proposalData = await votingManagerInstance.getProposal(tokenInstance.address, 1);
      assert.equal(proposalData[6].toNumber(), 55000);
      assert.equal(proposalData[7].toNumber(), 30000);
      assert.equal(proposalData[8].toNumber(), 15000);
      assert.equal(proposalData[9], true);

      let yesResults = await votingManagerInstance.getYesResults(tokenInstance.address, 1);
      assert.equal(yesResults.toNumber(), 64);

    });

  });

});