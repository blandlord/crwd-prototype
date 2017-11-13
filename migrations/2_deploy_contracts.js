const Registry = artifacts.require("./Registry.sol");
const CRWDToken = artifacts.require("./CRWDToken.sol");

module.exports = function (deployer) {
  deployer.deploy(Registry);
  deployer.deploy(CRWDToken);
};
