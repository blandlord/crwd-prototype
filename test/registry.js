const Registry = artifacts.require("./Registry.sol");

contract('Registry', function (accounts) {

  describe('addUserAddress', function () {

    let userAddress_1 = "0x0000000000000000000000000000000000000001";
    let userAddress_2 = "0x0000000000000000000000000000000000000002";

    it("anyone can add user addresses which can be retrieved", async function () {
      const instance = await  Registry.deployed();

      await instance.addUserAddress(userAddress_1, {from: accounts[0]});
      await instance.addUserAddress(userAddress_2, {from: accounts[1]});

      let savedAddress_1 = await instance.userAddresses(0);
      assert.equal(savedAddress_1, userAddress_1);

      let userData_1 = await instance.userDataStore(userAddress_1);
      assert.equal(userData_1[0].toNumber(), 0, "State should be NEW");
      assert.equal(userData_1[1], true);

      let savedAddress_2 = await instance.userAddresses(1);
      assert.equal(savedAddress_2, userAddress_2);

      let userData_2 = await instance.userDataStore(userAddress_2);
      assert.equal(userData_2[0].toNumber(), 0, "State should be NEW");
      assert.equal(userData_2[1], true);
    });

    it("adding an already existing user address throws an error", async function () {
      const instance = await  Registry.deployed();

      try {
        await instance.addUserAddress(userAddress_1, {from: accounts[0]});

        // we shouldn't get to this point
        assert(false, "Transaction should have failed");
      }
      catch (err) {
        if (err.toString().indexOf("invalid opcode") < 0) {
          assert(false, err.toString());
        }
      }
    });


    it("adding a null address throws an error", async function () {
      const instance = await  Registry.deployed();

      try {
        await instance.addUserAddress(null, {from: accounts[0]});

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

  describe('setState', function () {

    const STATE = { // values corresponding to solidity enum values
      NEW: 0,
      VERIFIED: 1,
      EXPIRED: 2
    };

    let userAddress_1 = "0x0000000000000000000000000000000000000001";

    it("owner can set state", async function () {
      const instance = await  Registry.deployed();

      await instance.setState(userAddress_1, STATE.VERIFIED, {from: accounts[0]});

      let userData_1 = await instance.userDataStore(userAddress_1);
      assert.equal(userData_1[0].toNumber(), STATE.VERIFIED, "State should be VERIFIED");
      assert.equal(userData_1[1], true);
    });

    it("now owner cannot set state", async function () {
      const instance = await  Registry.deployed();

      try {
        await instance.setState(userAddress_1, STATE.VERIFIED, {from: accounts[1]});

        // we shouldn't get to this point
        assert(false, "Transaction should have failed");
      }
      catch (err) {
        if (err.toString().indexOf("invalid opcode") < 0) {
          assert(false, err.toString());
        }
      }
    });

    it("cannot set invalid state", async function () {
      const instance = await  Registry.deployed();

      try {
        await instance.setState(userAddress_1, 10/*random inexisting value*/, {from: accounts[0]});

        // we shouldn't get to this point
        assert(false, "Transaction should have failed");
      }
      catch (err) {
        if (err.toString().indexOf("invalid opcode") < 0) {
          assert(false, err.toString());
        }
      }
    });

    it("cannot set state on inexisting user address", async function () {
      const instance = await  Registry.deployed();

      try {
        await instance.setState(userAddress_1.slice(0, -1) + "3", STATE.VERIFIED, {from: accounts[0]});

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
