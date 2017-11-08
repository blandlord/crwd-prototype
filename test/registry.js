const Registry = artifacts.require("./Registry.sol");

let STATE = require('./utils/state');

contract('Registry', function (accounts) {

  describe('addUserAddress/getUserAddresses', function () {

    let ssn_1 = "NL-1";
    let ssn_2 = "NL-2";

    it("anyone can add user addresses which can be retrieved", async function () {
      const instance = await  Registry.deployed();

      await instance.addUserAddress(ssn_1, {from: accounts[1]});
      await instance.addUserAddress(ssn_2, {from: accounts[2]});

      let savedAddress_1 = await instance.userAddresses(0);
      assert.equal(savedAddress_1, accounts[1]);

      let userData_1 = await instance.usersData(accounts[1]);
      assert.equal(userData_1[0].toNumber(), 0, "State should be NEW");
      assert.equal(userData_1[1], ssn_1);
      assert.equal(userData_1[2], true);

      let savedAddress_2 = await instance.userAddresses(1);
      assert.equal(savedAddress_2, accounts[2]);

      let userData_2 = await instance.usersData(accounts[2]);
      assert.equal(userData_2[0].toNumber(), 0, "State should be NEW");
      assert.equal(userData_2[1], ssn_2);
      assert.equal(userData_2[2], true);

      let userAddresses = await instance.getUserAddresses();
      assert.equal(userAddresses[0], accounts[1]);
      assert.equal(userAddresses[1], accounts[2]);
    });

    it("adding an already existing user address throws an error", async function () {
      const instance = await  Registry.deployed();

      try {
        await instance.addUserAddress("XYZ", {from: accounts[1]});

        // we shouldn't get to this point
        assert(false, "Transaction should have failed");
      }
      catch (err) {
        if (err.toString().indexOf("invalid opcode") < 0) {
          assert(false, err.toString());
        }
      }
    });

    it("adding a empty ssn throws an error", async function () {
      const instance = await  Registry.deployed();

      try {
        await instance.addUserAddress("", {from: accounts[0]});

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

    let userAddress;

    context('not owner', function () {

      before(function beforeTest() {
        userAddress = accounts[1];
      });

      it("not owner cannot set state", async function () {
        const instance = await  Registry.deployed();

        try {
          await instance.setState(accounts[1], STATE.VERIFIED, {from: userAddress});

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

    context('owner', function () {

      before(function beforeTest() {
        userAddress = accounts[0];
      });

      context('inexisting target address', function () {
        it("cannot set state on inexisting user address", async function () {
          const instance = await  Registry.deployed();

          try {
            await instance.setState("0x" + require('crypto').randomBytes(20).toString('hex'), STATE.VERIFIED, {from: userAddress});

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

      context('existing target address', function () {

        it("cannot set invalid state", async function () {
          const instance = await  Registry.deployed();

          try {
            await instance.setState(accounts[1], 55/*random inexisting value*/, {from: userAddress});

            // we shouldn't get to this point
            assert(false, "Transaction should have failed");
          }
          catch (err) {
            if (err.toString().indexOf("invalid opcode") < 0) {
              assert(false, err.toString());
            }
          }
        });

        it("cannot set invalid transition NEW -> EXPIRED", async function () {
          const instance = await  Registry.deployed();

          try {
            await instance.setState(accounts[1], STATE.EXPIRED, {from: userAddress});

            // we shouldn't get to this point
            assert(false, "Transaction should have failed");
          }
          catch (err) {
            if (err.toString().indexOf("invalid opcode") < 0) {
              assert(false, err.toString());
            }
          }
        });

        it("can set valid transition NEW -> VERIFIED", async function () {
          const instance = await  Registry.deployed();

          // Initial state is NEW
          await instance.setState(accounts[1], STATE.VERIFIED, {from: userAddress});

          let userData_1 = await instance.usersData(accounts[1]);
          assert.equal(userData_1[0].toNumber(), STATE.VERIFIED, "State should be VERIFIED");
          assert.equal(userData_1[1], "NL-1");
          assert.equal(userData_1[2], true);

          const verified = await instance.isVerifiedAndValid(accounts[1]);
          assert.equal(verified, true);
        });

        it("can set valid transition VERIFIED -> EXPIRED", async function () {
          const instance = await  Registry.deployed();

          await instance.setState(accounts[1], STATE.EXPIRED, {from: userAddress});

          let userData_1 = await instance.usersData(accounts[1]);
          assert.equal(userData_1[0].toNumber(), STATE.EXPIRED, "State should be EXPIRED");
          assert.equal(userData_1[1], "NL-1");
          assert.equal(userData_1[2], true);

          const verified = await instance.isVerifiedAndValid(accounts[1]);
          assert.equal(verified, false);
        });

        it("can set valid transition EXPIRED -> VERIFIED", async function () {
          const instance = await  Registry.deployed();

          await instance.setState(accounts[1], STATE.VERIFIED, {from: userAddress});

          let userData_1 = await instance.usersData(accounts[1]);
          assert.equal(userData_1[0].toNumber(), STATE.VERIFIED, "State should be VERIFIED");
          assert.equal(userData_1[1], "NL-1");
          assert.equal(userData_1[2], true);
        });

        it("can set valid transition VERIFIED -> DENIED", async function () {
          const instance = await  Registry.deployed();

          await instance.setState(accounts[1], STATE.DENIED, {from: userAddress});

          let userData_1 = await instance.usersData(accounts[1]);
          assert.equal(userData_1[0].toNumber(), STATE.DENIED, "State should be DENIED");
          assert.equal(userData_1[1], "NL-1");
          assert.equal(userData_1[2], true);
        });

        it("can set valid transition NEW -> DENIED", async function () {
          const instance = await  Registry.deployed();

          // Initial state is NEW
          await instance.setState(accounts[2], STATE.DENIED, {from: userAddress});

          let userData_2 = await instance.usersData(accounts[2]);
          assert.equal(userData_2[0].toNumber(), STATE.DENIED, "State should be DENIED");
          assert.equal(userData_2[1], "NL-2");
          assert.equal(userData_2[2], true);
        });

      });
    });

  });

});
