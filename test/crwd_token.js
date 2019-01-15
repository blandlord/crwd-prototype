const CRWDToken = artifacts.require("./CRWDToken.sol");

const expectRequireFailure = require('./support/expectRequireFailure');


contract('CRWDToken', function (accounts) {
  let web3, BN;
  let tokenInstance;

  before(async function beforeTest() {
    web3 = CRWDToken.web3;
    BN = web3.utils.BN;
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
      let totalSupplyExpected = (new BN(Math.pow(10, 8))).mul(web3.utils.toWei(new BN(1),"ether"));
      assert.equal(totalSupply.eq(totalSupplyExpected), true);
      let creatorBalance = await tokenInstance.balanceOf(accounts[0]);
      assert.equal(creatorBalance.eq(totalSupplyExpected), true);

    });
  });

  describe('transfer', function () {
    it("transferable to other user", async function () {
      await tokenInstance.transfer(accounts[1], new BN(1000000).mul(web3.utils.toWei(new BN(1),"ether")), { from: accounts[0] });

      let account_0_balance = await tokenInstance.balanceOf(accounts[0]);
      assert.equal(account_0_balance.toString(), new BN(99000000).mul(web3.utils.toWei(new BN(1),"ether")).toString());

      let account_1_balance = await tokenInstance.balanceOf(accounts[1]);
      assert.equal(account_1_balance.toString(), new BN(1000000).mul(web3.utils.toWei(new BN(1),"ether")).toString());
    });

    it("cannot transfer more than balance", async function () {
      await expectRequireFailure(() => tokenInstance.transfer(accounts[1], new BN(99500000).mul(web3.utils.toWei(new BN(1),"ether")), { from: accounts[0] }));
    });
  });

  describe('approve /transferFrom', function () {
    it("transferable to other preapproved user", async function () {
      await tokenInstance.approve(accounts[1], new BN(1000000).mul(web3.utils.toWei(new BN(1),"ether")), { from: accounts[0] });

      await tokenInstance.transferFrom(accounts[0], accounts[1], new BN(1000000).mul(web3.utils.toWei(new BN(1),"ether")), { from: accounts[1] });

      let account_0_balance = await tokenInstance.balanceOf(accounts[0]);
      assert.equal(account_0_balance.toString(), new BN(98000000).mul(web3.utils.toWei(new BN(1),"ether")).toString());

      let account_1_balance = await tokenInstance.balanceOf(accounts[1]);
      assert.equal(account_1_balance.toString(), new BN(2000000).mul(web3.utils.toWei(new BN(1),"ether")).toString());
    });

    it("cannot transfer more than preapproved", async function () {
      await expectRequireFailure(() => tokenInstance.transferFrom(accounts[0], accounts[1],  web3.utils.toWei(new BN(500),"ether"), { from: accounts[1] }));
    });
  });

});