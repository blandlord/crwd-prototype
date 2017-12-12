const CrowdOwnedExchange = artifacts.require("./CrowdOwnedExchange.sol");
const CrowdOwned = artifacts.require("./CrowdOwned.sol");
const Registry = artifacts.require("./Registry.sol");
const CRWDToken = artifacts.require("./CRWDToken.sol");

const expectRequireFailure = require('./support/expectRequireFailure');
const proxiedWeb3Handler = require('./support/proxiedWeb3Handler.js');

let STATE = require('./utils/state');


contract('CrowdOwnedExchange', function (accounts) {
  let web3, proxiedWeb3;
  let registryInstance, crwdTokenInstance, crowdOwnedExchangeInstance;
  let crowdOwnedInstance;

  before(async function beforeTest() {
    web3 = CrowdOwnedExchange.web3;
    proxiedWeb3 = new Proxy(web3, proxiedWeb3Handler);

    registryInstance = await Registry.deployed();
    crwdTokenInstance = await CRWDToken.deployed();
    crowdOwnedExchangeInstance = await CrowdOwnedExchange.deployed();

    crowdOwnedInstance = await CrowdOwned.new("Token 1", "TOK1", "http://example.com/tok1", accounts[0], registryInstance.address, crowdOwnedExchangeInstance.address);

    // add addresses 1 and 2 to registry
    await registryInstance.addUserAddress("SSN-1", {from: accounts[1]});
    await registryInstance.addUserAddress("SSN-2", {from: accounts[2]});

    // add account 5 as notary
    await registryInstance.addNotary(accounts[5], "my notary", "notary.example.com", {from: accounts[0]});

    // verify addresses 1 and 2
    await registryInstance.setState(accounts[1], STATE.VERIFIED, {from: accounts[5]});
    await registryInstance.setState(accounts[2], STATE.VERIFIED, {from: accounts[5]});

    // give tokens to users 1 & 2 for testing, user 0 is the deployer
    await crowdOwnedInstance.transfer(accounts[1], 1000, {from: accounts[0]});
    await crowdOwnedInstance.transfer(accounts[2], 1000, {from: accounts[0]});

    // give crwd tokens to users 1 & 2 for testing, user 0 is the deployer
    await crwdTokenInstance.transfer(accounts[1], 2000, {from: accounts[0]});
    await crwdTokenInstance.transfer(accounts[2], 2000, {from: accounts[0]});
  });

  describe('new', function newTest() {
    it('registry set ok', async function it() {
      let registryAddress = await crowdOwnedExchangeInstance.registry();

      assert.equal(registryAddress, registryInstance.address);
    });

    it('CRWDToken set ok', async function it() {
      let crwdTokenAddress = await crowdOwnedExchangeInstance.crwdToken();

      assert.equal(crwdTokenAddress, crwdTokenInstance.address);
    });
  });

  describe('depositCrowdOwnedTokens', function () {

    it('ok if transfer preapproved', async function it() {
      // first deposit
      await crowdOwnedInstance.approve(crowdOwnedExchangeInstance.address, 400, {from: accounts[1]});
      await crowdOwnedExchangeInstance.depositCrowdOwnedTokens(crowdOwnedInstance.address, 400, {from: accounts[1]});

      let user1BalanceInTokenContact = await crowdOwnedInstance.balanceOf(accounts[1]);
      assert.equal(user1BalanceInTokenContact.toNumber(), 600);

      let exchangeBalanceInTokenContact = await crowdOwnedInstance.balanceOf(crowdOwnedExchangeInstance.address);
      assert.equal(exchangeBalanceInTokenContact.toNumber(), 400);

      let user1BalanceInExchangeContact = await crowdOwnedExchangeInstance.tokenBalanceOf(crowdOwnedInstance.address, accounts[1]);
      assert.equal(user1BalanceInExchangeContact.toNumber(), 400);

      // second deposit
      await crowdOwnedInstance.approve(crowdOwnedExchangeInstance.address, 100, {from: accounts[2]});
      await crowdOwnedExchangeInstance.depositCrowdOwnedTokens(crowdOwnedInstance.address, 100, {from: accounts[2]});

      let user2BalanceInTokenContact = await crowdOwnedInstance.balanceOf(accounts[2]);
      assert.equal(user2BalanceInTokenContact.toNumber(), 900);

      exchangeBalanceInTokenContact = await crowdOwnedInstance.balanceOf(crowdOwnedExchangeInstance.address);
      assert.equal(exchangeBalanceInTokenContact.toNumber(), 500);

      let user2BalanceInExchangeContact = await crowdOwnedExchangeInstance.tokenBalanceOf(crowdOwnedInstance.address, accounts[2]);
      assert.equal(user2BalanceInExchangeContact.toNumber(), 100);
    });

    it('fails if transfer not preapproved', async function it() {
      await expectRequireFailure(() => crowdOwnedExchangeInstance.depositCrowdOwnedTokens(crowdOwnedInstance.address, 200, {from: accounts[3]}));
    });

  });

  describe('withdrawCrowdOwnedTokens', function () {

    it('ok if balance sufficient', async function it() {
      await crowdOwnedExchangeInstance.withdrawCrowdOwnedTokens(crowdOwnedInstance.address, 100, {from: accounts[1]});

      let user1BalanceInTokenContact = await crowdOwnedInstance.balanceOf(accounts[1]);
      assert.equal(user1BalanceInTokenContact.toNumber(), 700);

      let exchangeBalanceInTokenContact = await crowdOwnedInstance.balanceOf(crowdOwnedExchangeInstance.address);
      assert.equal(exchangeBalanceInTokenContact.toNumber(), 400);

      let user1BalanceInExchangeContact = await crowdOwnedExchangeInstance.tokenBalanceOf(crowdOwnedInstance.address, accounts[1]);
      assert.equal(user1BalanceInExchangeContact.toNumber(), 300);
    });

    it('fails if balance insufficient', async function it() {
      await expectRequireFailure(() => crowdOwnedExchangeInstance.withdrawCrowdOwnedTokens(crowdOwnedInstance.address, 500, {from: accounts[1]}));
    });
  });

  describe('depositCRWDTokens', function () {

    it('ok if transfer preapproved', async function it() {
      // first deposit
      await crwdTokenInstance.approve(crowdOwnedExchangeInstance.address, 800, {from: accounts[1]});
      await crowdOwnedExchangeInstance.depositCRWDTokens(800, {from: accounts[1]});

      let user1BalanceInTokenContact = await crwdTokenInstance.balanceOf(accounts[1]);
      assert.equal(user1BalanceInTokenContact.toNumber(), 1200);

      let exchangeBalanceInTokenContact = await crwdTokenInstance.balanceOf(crowdOwnedExchangeInstance.address);
      assert.equal(exchangeBalanceInTokenContact.toNumber(), 800);

      let user1BalanceInExchangeContact = await crowdOwnedExchangeInstance.crwdBalanceOf(accounts[1]);
      assert.equal(user1BalanceInExchangeContact.toNumber(), 800);

      // second deposit
      await crwdTokenInstance.approve(crowdOwnedExchangeInstance.address, 200, {from: accounts[2]});
      await crowdOwnedExchangeInstance.depositCRWDTokens(200, {from: accounts[2]});

      let user2BalanceInTokenContact = await crwdTokenInstance.balanceOf(accounts[2]);
      assert.equal(user2BalanceInTokenContact.toNumber(), 1800);

      exchangeBalanceInTokenContact = await crwdTokenInstance.balanceOf(crowdOwnedExchangeInstance.address);
      assert.equal(exchangeBalanceInTokenContact.toNumber(), 1000);

      let user2BalanceInExchangeContact = await crowdOwnedExchangeInstance.crwdBalanceOf(accounts[2]);
      assert.equal(user2BalanceInExchangeContact.toNumber(), 200);
    });

    it('fails if transfer not preapproved', async function it() {
      await expectRequireFailure(() => crowdOwnedExchangeInstance.depositCRWDTokens(400, {from: accounts[3]}));
    });

  });

  describe('withdrawCRWDTokens', function () {

    it('ok if balance sufficient', async function it() {
      await crowdOwnedExchangeInstance.withdrawCRWDTokens(200, {from: accounts[1]});

      let user1BalanceInTokenContact = await crwdTokenInstance.balanceOf(accounts[1]);
      assert.equal(user1BalanceInTokenContact.toNumber(), 1400);

      let exchangeBalanceInTokenContact = await crwdTokenInstance.balanceOf(crowdOwnedExchangeInstance.address);
      assert.equal(exchangeBalanceInTokenContact.toNumber(), 800);

      let user1BalanceInExchangeContact = await crowdOwnedExchangeInstance.crwdBalanceOf(accounts[1]);
      assert.equal(user1BalanceInExchangeContact.toNumber(), 600);
    });

    it('fails if balance insufficient', async function it() {
      await expectRequireFailure(() => crowdOwnedExchangeInstance.withdrawCRWDTokens(1000, {from: accounts[1]}));
    });
  });


});