const CRWDToken = artifacts.require("./CRWDToken.sol");

const expectRequireFailure = require('./support/expectRequireFailure');


contract('CRWDToken', function (accounts) {

  let tokenInstance;

  before(async function beforeTest() {
    tokenInstance = await CRWDToken.deployed();
  });

  describe('proper instantiation', function () {
    it("ok", async function () {
      let name = await tokenInstance.name();
      assert.equal(name, "Crowd City");
      let symbol = await tokenInstance.symbol();
      assert.equal(symbol, "CRWD");
      let decimals = await tokenInstance.decimals();
      assert.equal(decimals.toNumber(), 18);
      let totalSupply = await tokenInstance.totalSupply();
      assert.equal(totalSupply.toNumber(), Math.pow(10, 26));
      let creatorBalance = await tokenInstance.balanceOf(accounts[0]);
      assert.equal(creatorBalance.toNumber(), Math.pow(10, 26));

    });
  });

  describe('transfer', function () {
    it("transferable to other user", async function () {
      await tokenInstance.transfer(accounts[1], 1000000 * Math.pow(10, 18), {from: accounts[0]});

      let account_0_balance = await tokenInstance.balanceOf(accounts[0]);
      assert.equal(account_0_balance.toNumber(), 99000000 * Math.pow(10, 18));

      let account_1_balance = await tokenInstance.balanceOf(accounts[1]);
      assert.equal(account_1_balance.toNumber(), 1000000 * Math.pow(10, 18));
    });

    it("cannot transfer more than balance", async function () {
      await expectRequireFailure(() => tokenInstance.transfer(accounts[1], 99500000 * Math.pow(10, 18), {from: accounts[0]}));
    });
  });

  describe('approve /transferFrom', function () {
    it("transferable to other preapproved user", async function () {
      await tokenInstance.approve(accounts[1], 1000000 * Math.pow(10, 18), {from: accounts[0]});

      await tokenInstance.transferFrom(accounts[0], accounts[1], 1000000 * Math.pow(10, 18), {from: accounts[1]});

      let account_0_balance = await tokenInstance.balanceOf(accounts[0]);
      assert.equal(account_0_balance.toNumber(), 98000000 * Math.pow(10, 18));

      let account_1_balance = await tokenInstance.balanceOf(accounts[1]);
      assert.equal(account_1_balance.toNumber(), 2000000 * Math.pow(10, 18));
    });

    it("cannot transfer more than preapproved", async function () {
      await expectRequireFailure(() => tokenInstance.transferFrom(accounts[0], accounts[1], 500 * Math.pow(10, 18), {from: accounts[1]}));
    });
  });

});