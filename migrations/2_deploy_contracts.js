const Registry = artifacts.require("./Registry.sol");
const CRWDToken = artifacts.require("./CRWDToken.sol");
const VotingManager = artifacts.require("./VotingManager.sol");

module.exports = function (deployer) {
  deployer.deploy(Registry);
  deployer.deploy(CRWDToken);
  deployer.deploy(VotingManager);
};
