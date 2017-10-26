const Registry = artifacts.require("./Registry.sol");

contract('Registry', function (accounts) {
  it("placeholder test", async function () {
    const instance = await  Registry.deployed();
    assert.equal(1, 1);
  });
});
