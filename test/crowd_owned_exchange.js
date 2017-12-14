const CrowdOwnedExchange = artifacts.require("./CrowdOwnedExchange.sol");
const CrowdOwned = artifacts.require("./CrowdOwned.sol");
const Registry = artifacts.require("./Registry.sol");
const CRWDToken = artifacts.require("./CRWDToken.sol");

const expectRequireFailure = require('./support/expectRequireFailure');
const proxiedWeb3Handler = require('./support/proxiedWeb3Handler.js');

let STATE = require('./utils/state');
let ORDER_TYPE = require('./utils/orderType');

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

  // helper function
  async function getBalances(tokenAddress, userAddress) {
    let lockedCrwdBalance = await crowdOwnedExchangeInstance.lockedCrwdBalanceOf(userAddress);
    let crwdBalance = await crowdOwnedExchangeInstance.crwdBalanceOf(userAddress);
    let lockedTokenBalance = await crowdOwnedExchangeInstance.lockedTokenBalanceOf(tokenAddress, userAddress);
    let tokenBalance = await crowdOwnedExchangeInstance.tokenBalanceOf(tokenAddress, userAddress);

    return {
      lockedCrwdBalance: lockedCrwdBalance.toNumber(),
      crwdBalance: crwdBalance.toNumber(),
      lockedTokenBalance: lockedTokenBalance.toNumber(),
      tokenBalance: tokenBalance.toNumber(),
    }
  }


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
      await crowdOwnedInstance.approve(crowdOwnedExchangeInstance.address, 400, {from: accounts[2]});
      await crowdOwnedExchangeInstance.depositCrowdOwnedTokens(crowdOwnedInstance.address, 400, {from: accounts[2]});

      let user2BalanceInTokenContact = await crowdOwnedInstance.balanceOf(accounts[2]);
      assert.equal(user2BalanceInTokenContact.toNumber(), 600);

      exchangeBalanceInTokenContact = await crowdOwnedInstance.balanceOf(crowdOwnedExchangeInstance.address);
      assert.equal(exchangeBalanceInTokenContact.toNumber(), 800);

      let user2BalanceInExchangeContact = await crowdOwnedExchangeInstance.tokenBalanceOf(crowdOwnedInstance.address, accounts[2]);
      assert.equal(user2BalanceInExchangeContact.toNumber(), 400);
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
      assert.equal(exchangeBalanceInTokenContact.toNumber(), 700);

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
      await crwdTokenInstance.approve(crowdOwnedExchangeInstance.address, 1200, {from: accounts[2]});
      await crowdOwnedExchangeInstance.depositCRWDTokens(1200, {from: accounts[2]});

      let user2BalanceInTokenContact = await crwdTokenInstance.balanceOf(accounts[2]);
      assert.equal(user2BalanceInTokenContact.toNumber(), 800);

      exchangeBalanceInTokenContact = await crwdTokenInstance.balanceOf(crowdOwnedExchangeInstance.address);
      assert.equal(exchangeBalanceInTokenContact.toNumber(), 2000);

      let user2BalanceInExchangeContact = await crowdOwnedExchangeInstance.crwdBalanceOf(accounts[2]);
      assert.equal(user2BalanceInExchangeContact.toNumber(), 1200);
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
      assert.equal(exchangeBalanceInTokenContact.toNumber(), 1800);

      let user1BalanceInExchangeContact = await crowdOwnedExchangeInstance.crwdBalanceOf(accounts[1]);
      assert.equal(user1BalanceInExchangeContact.toNumber(), 600);
    });

    it('fails if balance insufficient', async function it() {
      await expectRequireFailure(() => crowdOwnedExchangeInstance.withdrawCRWDTokens(1000, {from: accounts[1]}));
    });
  });

  describe('createOrder/getOrder', function () {
    it("fails if CRWD balance insufficient for buy", async function () {
      let tokenAddress = crowdOwnedInstance.address;
      await expectRequireFailure(() => crowdOwnedExchangeInstance.createOrder(tokenAddress, ORDER_TYPE.BUY, 4, 200, {from: accounts[1]}));
    });

    it("fails if Token balance insufficient for sell", async function () {
      let tokenAddress = crowdOwnedInstance.address;
      await expectRequireFailure(() => crowdOwnedExchangeInstance.createOrder(tokenAddress, ORDER_TYPE.SELL, 4, 400, {from: accounts[1]}));
    });

    it("ok", async function () {
      let tokenAddress = crowdOwnedInstance.address;
      await crowdOwnedExchangeInstance.createOrder(tokenAddress, ORDER_TYPE.BUY, 1, 100, {from: accounts[1]});
      await crowdOwnedExchangeInstance.createOrder(tokenAddress, ORDER_TYPE.BUY, 2, 200, {from: accounts[1]});
      await crowdOwnedExchangeInstance.createOrder(tokenAddress, ORDER_TYPE.SELL, 3, 100, {from: accounts[2]});
      await crowdOwnedExchangeInstance.createOrder(tokenAddress, ORDER_TYPE.SELL, 4, 25, {from: accounts[2]});

      // check balances after orders created

      let user1Balances = await getBalances(tokenAddress, accounts[1]);
      assert.deepEqual(user1Balances,
        {
          crwdBalance: 100,
          lockedCrwdBalance: 500,
          tokenBalance: 300,
          lockedTokenBalance: 0,
        }
      );

      let user2Balances = await getBalances(tokenAddress, accounts[2]);
      assert.deepEqual(user2Balances,
        {
          crwdBalance: 1200,
          lockedCrwdBalance: 0,
          tokenBalance: 275,
          lockedTokenBalance: 125,
        }
      );

      // check orders

      const ordersLength = await crowdOwnedExchangeInstance.getOrdersLength(tokenAddress);
      assert.equal(ordersLength.toNumber(), 4);

      let orderIds = await crowdOwnedExchangeInstance.getOrderIds(tokenAddress);
      assert.deepEqual(orderIds.map((id) => id.toNumber()), [1, 2, 3, 4]);

      const order = await crowdOwnedExchangeInstance.getOrder(tokenAddress, 3);

      assert.equal(order[0].toNumber(), ORDER_TYPE.SELL);
      assert.equal(order[1].toNumber(), 3);
      assert.equal(order[2].toNumber(), 100);
      assert.equal(order[3], accounts[2]);
      assert.equal(order[4], false);
      assert.equal(order[5], false);
      assert.equal(order[6], true);
    });
  });

  describe('cancelOrder', function () {
    it("fails if cancel not from order creator", async function () {
      let tokenAddress = crowdOwnedInstance.address;
      await expectRequireFailure(() => crowdOwnedExchangeInstance.cancelOrder(tokenAddress, 3, {from: accounts[1]}));
    });

    it("ok for sell order", async function () {
      let tokenAddress = crowdOwnedInstance.address;
      await crowdOwnedExchangeInstance.cancelOrder(tokenAddress, 3, {from: accounts[2]});

      // check balances
      let user2Balances = await getBalances(tokenAddress, accounts[2]);
      assert.deepEqual(user2Balances,
        {
          crwdBalance: 1200,
          lockedCrwdBalance: 0,
          tokenBalance: 375,
          lockedTokenBalance: 25,
        }
      );

      const order = await crowdOwnedExchangeInstance.getOrder(tokenAddress, 3);
      assert.equal(order[0].toNumber(), ORDER_TYPE.SELL);
      assert.equal(order[1].toNumber(), 3);
      assert.equal(order[2].toNumber(), 100);
      assert.equal(order[3], accounts[2]);
      assert.equal(order[4], false);
      assert.equal(order[5], true);
      assert.equal(order[6], true);
    });

    it("fails if already canceled", async function () {
      let tokenAddress = crowdOwnedInstance.address;
      await expectRequireFailure(() => crowdOwnedExchangeInstance.cancelOrder(tokenAddress, 3, {from: accounts[2]}));
    });


    it("ok for buy order", async function () {
      let tokenAddress = crowdOwnedInstance.address;
      await crowdOwnedExchangeInstance.cancelOrder(tokenAddress, 1, {from: accounts[1]});

      // check balances
      let user1Balances = await getBalances(tokenAddress, accounts[1]);
      assert.deepEqual(user1Balances,
        {
          crwdBalance: 200,
          lockedCrwdBalance: 400,
          tokenBalance: 300,
          lockedTokenBalance: 0,
        }
      );

      const order = await crowdOwnedExchangeInstance.getOrder(tokenAddress, 1);
      assert.equal(order[0].toNumber(), ORDER_TYPE.BUY);
      assert.equal(order[1].toNumber(), 1);
      assert.equal(order[2].toNumber(), 100);
      assert.equal(order[3], accounts[1]);
      assert.equal(order[4], false);
      assert.equal(order[5], true);
      assert.equal(order[6], true);
    });
  });

  describe('takeOrder', function () {

    before(async function beforeTest() {
      let tokenAddress = crowdOwnedInstance.address;

      // check balances before order executed
      let user1Balances = await getBalances(tokenAddress, accounts[1]);
      assert.deepEqual(user1Balances,
        {
          crwdBalance: 200,
          lockedCrwdBalance: 400,
          tokenBalance: 300,
          lockedTokenBalance: 0,
        }
      );

      let user2Balances = await getBalances(tokenAddress, accounts[2]);
      assert.deepEqual(user2Balances,
        {
          crwdBalance: 1200,
          lockedCrwdBalance: 0,
          tokenBalance: 375,
          lockedTokenBalance: 25,
        }
      );

    });

    it("calling own order fails", async function () {
      let tokenAddress = crowdOwnedInstance.address;
      await expectRequireFailure(() => crowdOwnedExchangeInstance.takeOrder(tokenAddress, 2, {from: accounts[1]}));
    });

    it("buy order ok", async function () {
      let tokenAddress = crowdOwnedInstance.address;
      await crowdOwnedExchangeInstance.takeOrder(tokenAddress, 2, {from: accounts[2]});

      const order = await crowdOwnedExchangeInstance.getOrder(tokenAddress, 2);

      assert.equal(order[0].toNumber(), ORDER_TYPE.BUY);
      assert.equal(order[1].toNumber(), 2);
      assert.equal(order[2].toNumber(), 200);
      assert.equal(order[3], accounts[1]);
      assert.equal(order[4], true);
      assert.equal(order[5], false);
      assert.equal(order[6], true);

      // check balances after buy order executed
      let user1Balances = await getBalances(tokenAddress, accounts[1]);
      assert.deepEqual(user1Balances,
        {
          crwdBalance: 200,
          lockedCrwdBalance: 0,
          tokenBalance: 500,
          lockedTokenBalance: 0,
        }
      );
      let user2Balances = await getBalances(tokenAddress, accounts[2]);
      assert.deepEqual(user2Balances,
        {
          crwdBalance: 1600,
          lockedCrwdBalance: 0,
          tokenBalance: 175,
          lockedTokenBalance: 25,
        }
      );

    });

    it("fails if already executed", async function () {
      let tokenAddress = crowdOwnedInstance.address;
      await expectRequireFailure(() => crowdOwnedExchangeInstance.takeOrder(tokenAddress, 2, {from: accounts[2]}));
    });

    it("sell order ok", async function () {
      let tokenAddress = crowdOwnedInstance.address;
      await crowdOwnedExchangeInstance.takeOrder(tokenAddress, 4, {from: accounts[1]});

      const order = await crowdOwnedExchangeInstance.getOrder(tokenAddress, 4);

      assert.equal(order[0].toNumber(), ORDER_TYPE.SELL);
      assert.equal(order[1].toNumber(), 4);
      assert.equal(order[2].toNumber(), 25);
      assert.equal(order[3], accounts[2]);
      assert.equal(order[4], true);
      assert.equal(order[5], false);
      assert.equal(order[6], true);

      // check balances after buy order executed
      let user1Balances = await getBalances(tokenAddress, accounts[1]);
      assert.deepEqual(user1Balances,
        {
          crwdBalance: 100,
          lockedCrwdBalance: 0,
          tokenBalance: 525,
          lockedTokenBalance: 0,
        }
      );
      let user2Balances = await getBalances(tokenAddress, accounts[2]);
      assert.deepEqual(user2Balances,
        {
          crwdBalance: 1700,
          lockedCrwdBalance: 0,
          tokenBalance: 175,
          lockedTokenBalance: 0,
        }
      );
    });
  });

});