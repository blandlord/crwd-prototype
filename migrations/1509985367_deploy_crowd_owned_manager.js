const Registry = artifacts.require("./Registry.sol");
const CRWDToken = artifacts.require("./CRWDToken.sol");
const CrowdOwnedManager = artifacts.require("./CrowdOwnedManager.sol");

module.exports = function (deployer) {
  deployer.deploy(CrowdOwnedManager, Registry.address, CRWDToken.address);
};
