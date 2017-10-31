const Registry = artifacts.require("./Registry.sol");
const CRWDToken = artifacts.require("./CRWDToken.sol");

let STATE = require('./utils/state');

contract('CRWDToken', function (accounts) {

  describe('setRegistry', function () {

    it("owner can set registry address", async function () {
      const registryInstance = await Registry.deployed();
      const tokenInstance = await CRWDToken.deployed();

      await tokenInstance.setRegistry(registryInstance.address, {from: accounts[0]});

      let registryAddress = await tokenInstance.registry();
      assert.equal(registryAddress, registryInstance.address);
    });

    it("non owner cannot set registry address", async function () {
      const registryInstance = await Registry.deployed();
      const tokenInstance = await CRWDToken.deployed();

      try {
        await tokenInstance.setRegistry(registryInstance.address, {from: accounts[1]});

        // we shouldn't get to this point
        assert(false, "Transaction should have failed");
      }
      catch (err) {
        if (err.toString().indexOf("invalid opcode") < 0) {
          assert(false, err.toString());
        }
      }
    });

  });

  describe('transfer', function () {
    let registryInstance, tokenInstance;

    before(async function beforeTest() {
      registryInstance = await Registry.deployed();
      tokenInstance = await CRWDToken.deployed();

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
    });

    it("not transferable if destination is in registry list but not verified", async function () {
      try {
        await tokenInstance.transfer(accounts[2], 50, {from: accounts[0]});

        // we shouldn't get to this point
        assert(false, "Transaction should have failed");
      }
      catch (err) {
        if (err.toString().indexOf("invalid opcode") < 0) {
          assert(false, err.toString());
        }
      }
    });

    it("not transferable if destination is not in registry list", async function () {
      try {
        await tokenInstance.transfer(accounts[3], 50, {from: accounts[0]});

        // we shouldn't get to this point
        assert(false, "Transaction should have failed");
      }
      catch (err) {
        if (err.toString().indexOf("invalid opcode") < 0) {
          assert(false, err.toString());
        }
      }
    });

  });

});