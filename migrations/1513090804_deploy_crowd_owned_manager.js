const Registry = artifacts.require("./Registry.sol");
const CRWDToken = artifacts.require("./CRWDToken.sol");
const CrowdOwnedExchange = artifacts.require("./CrowdOwnedExchange.sol");
const CrowdOwnedManager = artifacts.require("./CrowdOwnedManager.sol");

module.exports = function (deployer) {
  deployer.deploy(CrowdOwnedManager, Registry.address, CRWDToken.address, CrowdOwnedExchange.address);
};
