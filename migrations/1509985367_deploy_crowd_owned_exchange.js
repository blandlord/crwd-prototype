const Registry = artifacts.require("./Registry.sol");
const CRWDToken = artifacts.require("./CRWDToken.sol");
const CrowdOwnedExchange = artifacts.require("./CrowdOwnedExchange.sol");

module.exports = function (deployer) {
  deployer.deploy(CrowdOwnedExchange, Registry.address, CRWDToken.address);
};
