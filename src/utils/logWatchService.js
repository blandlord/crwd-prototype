import contractService from '../utils/contractService';
import configureStore from '../store/configureStore';

import * as crowdOwnedExchangeActions from '../actions/crowdOwnedExchangeActions';
import * as registryActions from '../actions/registryActions';
import * as crowdOwnedActions from '../actions/crowdOwnedActions';
import * as votingManagerActions from '../actions/votingManagerActions';

let crowdOwnedExchangeEvents = [];
let notaryEvents = [];
let homeEvents = [];
let crowdOwnedDetailsEvents = [];

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

async function startHomeLogWatch(web3) {
  console.log("Starting HomeLogWatch ...");

  let store = configureStore();

  const crowdOwnedManagerInstance = await contractService.getDeployedInstance(web3, "CrowdOwnedManager");

  let loadCrowdOwnedContractsEvents = [
    crowdOwnedManagerInstance.CrowdOwnedDeployed({}),
  ];

  for (let i = 0; i < loadCrowdOwnedContractsEvents.length; i++) {
    let event = loadCrowdOwnedContractsEvents[i];
    event.watch(function (error, result) {
      if (error) {
        return console.log("[logWatchService] loadPendingProposalsEvents error:", error);
      }

      store.dispatch(crowdOwnedActions.loadCrowdOwnedContracts({}));
    });

    homeEvents.push(event);
  }

  const votingManagerInstance = await contractService.getDeployedInstance(web3, "VotingManager");

  let loadPendingProposalsEvents = [
    votingManagerInstance.NewProposal({}),
  ];

  for (let i = 0; i < loadPendingProposalsEvents.length; i++) {
    let event = loadPendingProposalsEvents[i];
    event.watch(function (error, result) {
      if (error) {
        return console.log("[logWatchService] loadPendingProposalsEvents error:", error);
      }

      store.dispatch(votingManagerActions.loadPendingProposals({}));
    });

    homeEvents.push(event);
  }
}

function stopHomeLogWatch() {
  console.log("Stopping HomeLogWatch ...");

  for (let i = 0; i < homeEvents.length; i++) {
    let event = homeEvents[i];

    event.stopWatching();
  }

  homeEvents = [];
}

async function startCrowdOwnedDetailsLogWatch(web3, crowdOwnedAddress) {
  console.log("Starting CrowdOwnedDetailsLogWatch ...");

  let store = configureStore();

  const crowdOwnedInstance = await contractService.getInstanceAt(web3, "CrowdOwned", crowdOwnedAddress);

  let loadCrowdOwnedContractEvents = [
    crowdOwnedInstance.Transfer({ to: web3.eth.defaultAccount }),
    crowdOwnedInstance.Transfer({ from: web3.eth.defaultAccount }),
    crowdOwnedInstance.ValuationSaved({}),
    crowdOwnedInstance.ValuationDeleted({}),
    crowdOwnedInstance.EthPaymentReceived({}),
  ];

  for (let i = 0; i < loadCrowdOwnedContractEvents.length; i++) {
    let event = loadCrowdOwnedContractEvents[i];
    event.watch(function (error, result) {
      if (error) {
        return console.log("[logWatchService] loadCrowdOwnedContractEvents error:", error);
      }

      store.dispatch(crowdOwnedActions.loadCrowdOwnedContract({ contractAddress: crowdOwnedAddress }));
    });

    crowdOwnedDetailsEvents.push(event);
  }

  const crowdOwnedExchangeInstance = await contractService.getDeployedInstance(web3, "CrowdOwnedExchange");

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

    crowdOwnedDetailsEvents.push(event);
  }

  const votingManagerInstance = await contractService.getDeployedInstance(web3, "VotingManager");

  let loadPendingProposalsEvents = [
    votingManagerInstance.NewProposal({}),
  ];

  for (let i = 0; i < loadPendingProposalsEvents.length; i++) {
    let event = loadPendingProposalsEvents[i];
    event.watch(function (error, result) {
      if (error) {
        return console.log("[logWatchService] loadPendingProposalsEvents error:", error);
      }

      store.dispatch(votingManagerActions.loadProposals({ crowdOwnedAddress }));
    });

    crowdOwnedDetailsEvents.push(event);
  }
}

function stopCrowdOwnedDetailsLogWatch() {
  console.log("Stopping CrowdOwnedDetailsLogWatch ...");

  for (let i = 0; i < crowdOwnedDetailsEvents.length; i++) {
    let event = crowdOwnedDetailsEvents[i];

    event.stopWatching();
  }

  crowdOwnedDetailsEvents = [];
}

let logWatchService = {
  startCrowdOwnedExchangeLogWatch: startCrowdOwnedExchangeLogWatch,
  stopCrowdOwnedExchangeLogWatch: stopCrowdOwnedExchangeLogWatch,
  startNotaryLogWatch: startNotaryLogWatch,
  stopNotaryLogWatch: stopNotaryLogWatch,
  startHomeLogWatch: startHomeLogWatch,
  stopHomeLogWatch: stopHomeLogWatch,
  startCrowdOwnedDetailsLogWatch: startCrowdOwnedDetailsLogWatch,
  stopCrowdOwnedDetailsLogWatch: stopCrowdOwnedDetailsLogWatch,
};

export default logWatchService;