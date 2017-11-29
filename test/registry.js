const Registry = artifacts.require("./Registry.sol");

let STATE = require('./utils/state');

const expectRequireFailure = require('./support/expectRequireFailure');

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

      await expectRequireFailure(() => instance.addUserAddress("XYZ", {from: accounts[1]}));
    });

    it("adding a empty ssn throws an error", async function () {
      const instance = await  Registry.deployed();

      await expectRequireFailure(() => instance.addUserAddress("", {from: accounts[0]}));
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

        await expectRequireFailure(() => instance.setState(accounts[1], STATE.VERIFIED, {from: userAddress}));
      });

    });

    context('owner', function () {

      before(function beforeTest() {
        userAddress = accounts[0];
      });

      context('inexisting target address', function () {
        it("cannot set state on inexisting user address", async function () {
          const instance = await  Registry.deployed();

          await expectRequireFailure(() => instance.setState("0x" + require('crypto').randomBytes(20).toString('hex'), STATE.VERIFIED, {from: userAddress}));
        });
      });

      context('existing target address', function () {

        it("cannot set invalid state", async function () {
          const instance = await  Registry.deployed();

          await expectRequireFailure(() => instance.setState(accounts[1], 55/*random inexisting value*/, {from: userAddress}));
        });

        it("cannot set invalid transition NEW -> EXPIRED", async function () {
          const instance = await  Registry.deployed();

          await expectRequireFailure(() => instance.setState(accounts[1], STATE.EXPIRED, {from: userAddress}));
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

  describe('addNotary/getNotaryAddresses', function () {

    let notary_1 = {
      address: accounts[5],
      name: "Notary 1",
      websiteUrl: "http://www.notary1.example.com"
    };
    let notary_2 = {
      address: accounts[6],
      name: "Notary 2",
      websiteUrl: "http://www.notary2.example.com"
    };

    it("adding as not an owner throws an error", async function () {
      const instance = await  Registry.deployed();

      await expectRequireFailure(() => instance.addNotary(notary_1.address, notary_1.name, notary_1.websiteUrl, {from: accounts[1]}));
    });

    it("the owner can add notaries which can be retrieved", async function () {
      const instance = await  Registry.deployed();

      await instance.addNotary(notary_1.address, notary_1.name, notary_1.websiteUrl, {from: accounts[0]});
      await instance.addNotary(notary_2.address, notary_2.name, notary_2.websiteUrl, {from: accounts[0]});

      let notaryAddresses = await instance.getNotaryAddresses();
      assert.equal(notaryAddresses[0], notary_1.address);
      assert.equal(notaryAddresses[1], notary_2.address);

      let notaryData_1 = await instance.notariesData(notary_1.address);
      assert.equal(notaryData_1[0], notary_1.name);
      assert.equal(notaryData_1[1], notary_1.websiteUrl);
      assert.equal(notaryData_1[2], true);

      let notaryData_2 = await instance.notariesData(notary_2.address);
      assert.equal(notaryData_2[0], notary_2.name);
      assert.equal(notaryData_2[1], notary_2.websiteUrl);
      assert.equal(notaryData_2[2], true);
    });

    it("adding an already existing user address throws an error", async function () {
      const instance = await  Registry.deployed();

      await expectRequireFailure(() => instance.addNotary(notary_1.address, notary_1.name, notary_1.websiteUrl, {from: accounts[0]}));
    });

    it("adding a empty address throws an error", async function () {
      const instance = await  Registry.deployed();

      await expectRequireFailure(() => instance.addNotary("", "name", "example.com", {from: accounts[0]}));
    });

    it("adding a empty name throws an error", async function () {
      const instance = await  Registry.deployed();

      await expectRequireFailure(() => instance.addNotary("0x0001", "", "example.com", {from: accounts[0]}));
    });

    it("adding a empty website url throws an error", async function () {
      const instance = await  Registry.deployed();

      await expectRequireFailure(() => instance.addNotary("0x0001", "name", "", {from: accounts[0]}));
    });

  });

});
