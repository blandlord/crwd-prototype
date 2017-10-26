const Registry = artifacts.require("./Registry.sol");

contract('Registry', function (accounts) {

  describe('addUserAddress', function () {

    it("anyone can add user addresses which can be retrieved", async function () {
      const instance = await  Registry.deployed();

      let userAddress_1 = "0x1000000000000000000000000000000000000000";
      let userAddress_2 = "0x2000000000000000000000000000000000000000";

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

      let userAddress_1 = "0x1000000000000000000000000000000000000000";

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

});
