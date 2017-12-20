import contractService from '../utils/contractService';
import configureStore from '../store/configureStore';

import * as crowdOwnedExchangeActions from '../actions/crowdOwnedExchangeActions';

async function start(web3, params = {}) {
  let store = configureStore();

  if (params.crowdOwnedAddress) {
    console.log("Starting exchange logWatch ...");

    let crowdOwnedAddress = params.crowdOwnedAddress;

    const crowdOwnedExchangeInstance = await contractService.getDeployedInstance(web3, "CrowdOwnedExchange");
    const crowdOwnedInstance = await contractService.getInstanceAt(web3, "CrowdOwned", crowdOwnedAddress);
    const crwdTokenInstance = await contractService.getDeployedInstance(web3, "CRWDToken");

    let loadBalancesEvents = [
      crwdTokenInstance.Transfer({to: web3.eth.defaultAccount}),
      crwdTokenInstance.Transfer({from: web3.eth.defaultAccount}),
      crowdOwnedInstance.Transfer({to: web3.eth.defaultAccount}),
      crowdOwnedInstance.Transfer({from: web3.eth.defaultAccount}),
      crowdOwnedExchangeInstance.TokenDeposit({
        _userAddress: web3.eth.defaultAccount,
        _tokenAddress: crowdOwnedAddress
      }),
      crowdOwnedExchangeInstance.TokenWithdrawal({
        _userAddress: web3.eth.defaultAccount,
        _tokenAddress: crowdOwnedAddress
      }),
      crowdOwnedExchangeInstance.CRWDDeposit({
        _userAddress: web3.eth.defaultAccount,
      }),
      crowdOwnedExchangeInstance.CRWDWithdrawal({
        _userAddress: web3.eth.defaultAccount,
      }),
      crowdOwnedExchangeInstance.LockedTokenBalance({
        _userAddress: web3.eth.defaultAccount,
        _tokenAddress: crowdOwnedAddress
      }),
      crowdOwnedExchangeInstance.UnlockedTokenBalance({
        _userAddress: web3.eth.defaultAccount,
        _tokenAddress: crowdOwnedAddress
      }),
      crowdOwnedExchangeInstance.LockedCrwdBalance({
        _userAddress: web3.eth.defaultAccount,
      }),
      crowdOwnedExchangeInstance.UnlockedCrwdBalance({
        _userAddress: web3.eth.defaultAccount,
      }),
      crowdOwnedExchangeInstance.OrderTaken({
        _takerAddress: web3.eth.defaultAccount,
        _tokenAddress: crowdOwnedAddress
      }),
    ];

    for (let i = 0; i < loadBalancesEvents.length; i++) {
      let event = loadBalancesEvents[i];
      event.watch(function (error, result) {
        if (error) {
          return console.log("[logWatchService] loadBalancesEvents error:", error);
        }

        console.log("loadBalancesEvents",result)
        store.dispatch(crowdOwnedExchangeActions.loadBalances({crowdOwnedAddress}));
      });
    }

    let loadOrdersEvents = [
      crowdOwnedExchangeInstance.OrderCreated({
        _tokenAddress: crowdOwnedAddress
      }),
      crowdOwnedExchangeInstance.OrderCanceled({
        _tokenAddress: crowdOwnedAddress
      }),
      crowdOwnedExchangeInstance.OrderTaken({
        _tokenAddress: crowdOwnedAddress
      }),
    ];

    for (let i = 0; i < loadOrdersEvents.length; i++) {
      let event = loadOrdersEvents[i];
      event.watch(function (error, result) {
        if (error) {
          return console.log("[logWatchService] loadOrdersEvents error:", error);
        }

        console.log("loadOrdersEvents",result)
        store.dispatch(crowdOwnedExchangeActions.loadOrders({crowdOwnedAddress}));
      });
    }
  }
}


let logWatchService = {
  start: start
};

export default logWatchService;