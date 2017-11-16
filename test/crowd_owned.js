const Registry = artifacts.require("./Registry.sol");
const CrowdOwned = artifacts.require("./CrowdOwned.sol");
const CRWDToken = artifacts.require("./CRWDToken.sol");

const expectRequireFailure = require('./support/expectRequireFailure');
const proxiedWeb3Handler = require('./support/proxiedWeb3Handler.js');


let STATE = require('./utils/state');

contract('CrowdOwned', function (accounts) {

  let web3, proxiedWeb3, registryInstance, crwdTokenInstance, tokenInstance;

  before(async function beforeTest() {
    web3 = CrowdOwned.web3;
    proxiedWeb3 = new Proxy(web3, proxiedWeb3Handler);

    registryInstance = await Registry.deployed();
    crwdTokenInstance = await CRWDToken.deployed();
    tokenInstance = await CrowdOwned.new("My Token", "MYT", "http://example.com/image", accounts[0], registryInstance.address, {gas: 3000000});
  });

  describe('proper instantiation', function () {
    it("ok", async function () {
      let name = await tokenInstance.name();
      assert.equal(name, "My Token");
      let symbol = await tokenInstance.symbol();
      assert.equal(symbol, "MYT");
      let imageUrl = await tokenInstance.imageUrl();
      assert.equal(imageUrl, "http://example.com/image");

      let ownerAddresses = await tokenInstance.getOwnerAddresses();
      assert.deepEqual(ownerAddresses, [accounts[0]]);
    });
  });

  describe('setRegistry', function () {

    it("owner can set registry address", async function () {
      await tokenInstance.setRegistry(registryInstance.address, {from: accounts[0]});

      let registryAddress = await tokenInstance.registry();
      assert.equal(registryAddress, registryInstance.address);
    });

    it("non owner cannot set registry address", async function () {
      await expectRequireFailure(() => tokenInstance.setRegistry(registryInstance.address, {from: accounts[1]}));
    });

  });

  describe('transfer', function () {

    before(async function beforeTest() {
      // add addresses to registry
      await registryInstance.addUserAddress("SSN-1", {from: accounts[1]});
      await registryInstance.addUserAddress("SSN-2", {from: accounts[2]});

      // verify address 1
      await registryInstance.setState(accounts[1], STATE.VERIFIED, {from: accounts[0]});
    });

    it("transferable if destination is in registry list & verified", async function () {
      await tokenInstance.transfer(accounts[1], 50, {from: accounts[0]});

      let account_0_balance = await tokenInstance.balanceOf(accounts[0]);
      assert.equal(account_0_balance.toNumber(), 99950);

      let account_1_balance = await tokenInstance.balanceOf(accounts[1]);
      assert.equal(account_1_balance.toNumber(), 50);

      // second transfer to make sure owner only added to list once
      await tokenInstance.transfer(accounts[1], 100, {from: accounts[0]});

      let ownerAddresses = await tokenInstance.getOwnerAddresses();
      assert.deepEqual(ownerAddresses, [accounts[0], accounts[1]]);
    });

    it("not transferable if destination is in registry list but not verified", async function () {
      await expectRequireFailure(() => tokenInstance.transfer(accounts[2], 50, {from: accounts[0]}));
    });

    it("not transferable if destination is not in registry list", async function () {
      await expectRequireFailure(() => tokenInstance.transfer(accounts[3], 50, {from: accounts[0]}));
    });

  });

  describe('totalSupply/circulatingSupply', function () {

    before(async function beforeTest() {
      await tokenInstance.transfer(tokenInstance.address, 10000, {from: accounts[0]});
    });

    it("ok", async function () {
      let totalSupply = await tokenInstance.totalSupply();
      assert.equal(totalSupply.toNumber(), 100000);

      let circulatingSupply = await tokenInstance.circulatingSupply();
      assert.equal(circulatingSupply.toNumber(), 90000);
    });

  });

  describe('saveValuation / getLastValuationBlockheight / deleteValuation', function () {

    it("ok", async function () {
      let lastValuationBlockheight = await tokenInstance.getLastValuationBlockheight();
      assert.equal(lastValuationBlockheight.toNumber(), 0);

      await tokenInstance.saveValuation(1111, "EUR", 5000);

      lastValuationBlockheight = await tokenInstance.getLastValuationBlockheight();
      assert.equal(lastValuationBlockheight.toNumber(), 1111);

      let blockheight = await tokenInstance.valuationBlockheights(0);
      assert.equal(blockheight.toNumber(), 1111);

      let valuationData = await tokenInstance.valuationsData(blockheight);
      assert.equal(web3.toAscii(valuationData[0]).replace(/\u0000/g, ""), "EUR");
      assert.equal(valuationData[1].toNumber(), 5000);
      assert.equal(valuationData[2], true);

      await tokenInstance.saveValuation(2222, "EUR", 10000);
      await tokenInstance.saveValuation(3333, "EUR", 15000);
      await tokenInstance.saveValuation(4444, "EUR", 20000);

      lastValuationBlockheight = await tokenInstance.getLastValuationBlockheight();
      assert.equal(lastValuationBlockheight.toNumber(), 4444);

      await tokenInstance.deleteValuation(4444);

      lastValuationBlockheight = await tokenInstance.getLastValuationBlockheight();
      assert.equal(lastValuationBlockheight.toNumber(), 3333);
    });

  });

  describe('getValuation', function () {

    it("ok", async function () {
      let valuation = await tokenInstance.getValuation(0);
      assert.equal(valuation[0], 3333);
      assert.equal(web3.toAscii(valuation[1]).replace(/\u0000/g, ""), "EUR");
      assert.equal(valuation[2].toNumber(), 15000);
      assert.equal(valuation[3], true);

      valuation = await tokenInstance.getValuation(2222);
      assert.equal(valuation[0], 2222);
      assert.equal(web3.toAscii(valuation[1]).replace(/\u0000/g, ""), "EUR");
      assert.equal(valuation[2].toNumber(), 10000);
      assert.equal(valuation[3], true);
    });

  });

  describe('kill', function () {
    let crwdTotalSupply;

    before(async function beforeTest() {
      await proxiedWeb3.eth.sendTransaction({
        from: accounts[0],
        to: tokenInstance.address,
        value: web3.toWei(0.5, "ether")
      });

      crwdTotalSupply = (await crwdTokenInstance.totalSupply()).toNumber();

      await crwdTokenInstance.transfer(tokenInstance.address, Math.pow(10, 18), {from: accounts[0]});
    });

    it("not owner cannot kill", async function () {
      await expectRequireFailure(() => tokenInstance.kill(crwdTokenInstance.address, {from: accounts[1]}));
    });

    it("if owner kills and sends funds to owner", async function () {
      let contractEthBalance = await proxiedWeb3.eth.getBalance(tokenInstance.address);
      assert.equal(contractEthBalance.toNumber(), web3.toWei(0.5, "ether"));

      let contractCrwdBalance = await crwdTokenInstance.balanceOf(tokenInstance.address);
      assert.equal(contractCrwdBalance.toNumber(), Math.pow(10, 18));

      let ownerCrwdBalance = await crwdTokenInstance.balanceOf(accounts[0]);
      assert.equal(ownerCrwdBalance.toNumber(), crwdTotalSupply - Math.pow(10, 18));

      let ownerEthBalance = await proxiedWeb3.eth.getBalance(accounts[0]);

      await tokenInstance.kill(crwdTokenInstance.address, {from: accounts[0]});

      let newContractEthBalance = await proxiedWeb3.eth.getBalance(tokenInstance.address);
      assert.equal(newContractEthBalance.toNumber(), 0);

      let newOwnerEthBalance = await proxiedWeb3.eth.getBalance(accounts[0]);
      assert.equal(newOwnerEthBalance.toNumber() > ownerEthBalance.toNumber() + parseInt(web3.toWei(0.49, "ether")), true); // account for gas

      let newContractCrwdBalance = await crwdTokenInstance.balanceOf(tokenInstance.address);
      assert.equal(newContractCrwdBalance.toNumber(), 0);

      let newOwnerCrwdBalance = await crwdTokenInstance.balanceOf(accounts[0]);
      assert.equal(newOwnerCrwdBalance.toNumber(), crwdTotalSupply);

      let code = await proxiedWeb3.eth.getCode(tokenInstance.address);
      assert.equal(code, "0x0");
    });
  });

});