var Registry = artifacts.require("./Registry.sol");
var CRWDToken = artifacts.require("./CRWDToken.sol");

module.exports = function (deployer) {
  deployer.deploy(Registry);
  deployer.deploy(CRWDToken);
};
