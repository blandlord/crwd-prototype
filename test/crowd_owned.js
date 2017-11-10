const Registry = artifacts.require("./Registry.sol");
const CrowdOwned = artifacts.require("./CrowdOwned.sol");

const expectRequireFailure = require('./support/expectRequireFailure');

let STATE = require('./utils/state');

contract('CrowdOwned', function (accounts) {

  let registryInstance, tokenInstance;

  before(async function beforeTest() {
    registryInstance = await Registry.deployed();
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
      await expectRequireFailure(() =>tokenInstance.setRegistry(registryInstance.address, {from: accounts[1]}));
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
      assert.deepEqual(ownerAddresses, [accounts[0],accounts[1]]);
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


});