import contractService from '../utils/contractService';
import configureStore from '../store/configureStore';

import * as crowdOwnedExchangeActions from '../actions/crowdOwnedExchangeActions';
import * as registryActions from '../actions/registryActions';

let crowdOwnedExchangeEvents = [];
let notaryEvents = [];

async function startCrowdOwnedExchangeLogWatch(web3, crowdOwnedAddress) {
  if (!crowdOwnedAddress) {
    throw new Error("CrowdOwnedExchangeLogWatch cannot start without a crowdOwnedAddress");
  }

  console.log("Starting CrowdOwnedExchangeLogWatch ...");

  let store = configureStore();

  const crowdOwnedExchangeInstance = await contractService.getDeployedInstance(web3, "CrowdOwnedExchange");
  const crowdOwnedInstance = await contractService.getInstanceAt(web3, "CrowdOwned", crowdOwnedAddress);
  const crwdTokenInstance = await contractService.getDeployedInstance(web3, "CRWDToken");

  let loadBalancesEvents = [
    crwdTokenInstance.Transfer({ to: web3.eth.defaultAccount }),
    crwdTokenInstance.Transfer({ from: web3.eth.defaultAccount }),
    crowdOwnedInstance.Transfer({ to: web3.eth.defaultAccount }),
    crowdOwnedInstance.Transfer({ from: web3.eth.defaultAccount }),
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

      store.dispatch(crowdOwnedExchangeActions.loadBalances({ crowdOwnedAddress }));
    });

    crowdOwnedExchangeEvents.push(event);
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

      store.dispatch(crowdOwnedExchangeActions.loadOrders({ crowdOwnedAddress }));
    });

    crowdOwnedExchangeEvents.push(event);
  }
}

function stopCrowdOwnedExchangeLogWatch() {
  console.log("Stopping CrowdOwnedExchangeLogWatch ...");

  for (let i = 0; i < crowdOwnedExchangeEvents.length; i++) {
    let event = crowdOwnedExchangeEvents[i];

    event.stopWatching();
  }

  crowdOwnedExchangeEvents = [];
}

async function startNotaryLogWatch(web3) {
  console.log("Starting NotaryLogWatch ...");

  let store = configureStore();

  const registryInstance = await contractService.getDeployedInstance(web3, "Registry");

  let loadUsersDataEvents = [
    registryInstance.AddressAdded({}),
    registryInstance.StateUpdated({}),
  ];

  for (let i = 0; i < loadUsersDataEvents.length; i++) {
    let event = loadUsersDataEvents[i];
    event.watch(function (error, result) {
      if (error) {
        return console.log("[logWatchService] loadUsersDataEvents error:", error);
      }

      console.log("got event")

      store.dispatch(registryActions.loadUsersData({}));
    });

    notaryEvents.push(event);
  }
}

function stopNotaryLogWatch() {
  console.log("Stopping NotaryLogWatch ...");

  for (let i = 0; i < notaryEvents.length; i++) {
    let event = notaryEvents[i];

    event.stopWatching();
  }

  notaryEvents = [];
}


let logWatchService = {
  startCrowdOwnedExchangeLogWatch: startCrowdOwnedExchangeLogWatch,
  stopCrowdOwnedExchangeLogWatch: stopCrowdOwnedExchangeLogWatch,
  startNotaryLogWatch: startNotaryLogWatch,
  stopNotaryLogWatch: stopNotaryLogWatch,
};

export default logWatchService;