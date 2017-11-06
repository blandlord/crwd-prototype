const Registry = artifacts.require("./Registry.sol");
const CrowdOwnedManager = artifacts.require("./CrowdOwnedManager.sol");

module.exports = function(deployer) {
  deployer.deploy(CrowdOwnedManager, Registry.address);
};
