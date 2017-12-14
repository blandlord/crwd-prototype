import contractService from '../utils/contractService';
import orderDataHelpers from '../utils/orderDataHelpers';

const _ = require("lodash");

async function loadOrders(web3, crowdOwnedAddress) {
  const crowdOwnedExchangeInstance = await contractService.getDeployedInstance(web3, "CrowdOwnedExchange");

  let orderIds = await crowdOwnedExchangeInstance.getOrderIds(crowdOwnedAddress);

  const orders = [];

  for (let i = 0; i < orderIds.length; i++) {
    let orderId = orderIds[i];
    const orderData = await crowdOwnedExchangeInstance.getOrder(crowdOwnedAddress, orderId);

    let isOrderData = orderData[6]; // make sure value exists
    let executed = orderData[4];
    let canceled = orderData[5];
    if (isOrderData && !executed && !canceled) {
      orders.push({
        orderType: orderDataHelpers.getOrderTypeText(orderData[0].toNumber()),
        price: orderData[1].toNumber(),
        amount: orderData[2].toNumber(),
        userAddress: orderData[3],
        id: orderId,
      });
    }
  }

  return orders;
}

async function createOrder(web3, orderData) {
  const crowdOwnedExchangeInstance = await contractService.getDeployedInstance(web3, "CrowdOwnedExchange");

  let isBalanceSufficient = await crowdOwnedExchangeInstance.isBalanceSufficient(true, orderData.tokenAddress, orderData.orderType, orderData.price, orderData.amount);
  if (!isBalanceSufficient) {
    throw new Error(`Balance insufficient for this order`);
  }

  let results = await crowdOwnedExchangeInstance.createOrder(orderData.tokenAddress, orderData.orderType, orderData.price, orderData.amount, {gas: 200000});
  return results;
}

async function cancelOrder(web3, tokenAddress, orderId) {
  const crowdOwnedExchangeInstance = await contractService.getDeployedInstance(web3, "CrowdOwnedExchange");

  let results = crowdOwnedExchangeInstance.cancelOrder(tokenAddress, orderId, {gas: 200000});
  return results;
}

async function takeOrder(web3, tokenAddress, orderId) {
  const crowdOwnedExchangeInstance = await contractService.getDeployedInstance(web3, "CrowdOwnedExchange");

  let results = crowdOwnedExchangeInstance.takeOrder(tokenAddress, orderId, {gas: 200000});
  return results;
}

async function loadBalances(web3, crowdOwnedAddress) {
  const crowdOwnedExchangeInstance = await contractService.getDeployedInstance(web3, "CrowdOwnedExchange");
  const crowdOwnedInstance = await contractService.getInstanceAt(web3, "CrowdOwned", crowdOwnedAddress);
  const crwdTokenInstance = await contractService.getDeployedInstance(web3, "CRWDToken");

  const tokenBalance = await crowdOwnedExchangeInstance.tokenBalanceOf(crowdOwnedAddress, web3.eth.defaultAccount);
  const lockedTokenBalance = await crowdOwnedExchangeInstance.lockedTokenBalanceOf(crowdOwnedAddress, web3.eth.defaultAccount);
  const walletTokenBalance = await crowdOwnedInstance.balanceOf(web3.eth.defaultAccount);

  const crwdBalance = await crowdOwnedExchangeInstance.crwdBalanceOf(web3.eth.defaultAccount);
  const lockedCrwdBalance = await crowdOwnedExchangeInstance.lockedCrwdBalanceOf(web3.eth.defaultAccount);
  const walletCrwdBalance = await crwdTokenInstance.balanceOf(web3.eth.defaultAccount);

  return {
    tokenBalance: tokenBalance.toNumber(),
    lockedTokenBalance: lockedTokenBalance.toNumber(),
    walletTokenBalance: walletTokenBalance.toNumber(),
    crwdBalance: crwdBalance.toNumber(),
    lockedCrwdBalance: lockedCrwdBalance.toNumber(),
    walletCrwdBalance: walletCrwdBalance.toNumber(),
  };
}

async function depositCrowdOwnedTokens(web3, crowdOwnedAddress, amount) {
  const crowdOwnedExchangeInstance = await contractService.getDeployedInstance(web3, "CrowdOwnedExchange");
  const crowdOwnedInstance = await contractService.getInstanceAt(web3, "CrowdOwned", crowdOwnedAddress);

  // no need to await as this would run previous to the deposit
  crowdOwnedInstance.increaseApproval(crowdOwnedExchangeInstance.address, amount, {gas: 100000});
  let results = await crowdOwnedExchangeInstance.depositCrowdOwnedTokens(crowdOwnedAddress, amount, {gas: 100000});
  return results;
}

async function withdrawCrowdOwnedTokens(web3, crowdOwnedAddress, amount) {
  const crowdOwnedExchangeInstance = await contractService.getDeployedInstance(web3, "CrowdOwnedExchange");

  let results = await crowdOwnedExchangeInstance.withdrawCrowdOwnedTokens(crowdOwnedAddress, amount, {gas: 100000});
  return results;
}

async function depositCRWDTokens(web3, amount) {
  const crowdOwnedExchangeInstance = await contractService.getDeployedInstance(web3, "CrowdOwnedExchange");
  const crwdTokenInstance = await contractService.getDeployedInstance(web3, "CRWDToken");

  // no need to await as this would run previous to the deposit
  crwdTokenInstance.increaseApproval(crowdOwnedExchangeInstance.address, amount, {gas: 100000});
  let results = await crowdOwnedExchangeInstance.depositCRWDTokens(amount, {gas: 100000});
  return results;
}

async function withdrawCRWDTokens(web3, amount) {
  const crowdOwnedExchangeInstance = await contractService.getDeployedInstance(web3, "CrowdOwnedExchange");

  let results = await crowdOwnedExchangeInstance.withdrawCRWDTokens(amount, {gas: 100000});
  return results;
}


let crowdOwnedExchangeService = {
  loadOrders,
  createOrder,
  cancelOrder,
  takeOrder,
  loadBalances,
  depositCrowdOwnedTokens,
  withdrawCrowdOwnedTokens,
  depositCRWDTokens,
  withdrawCRWDTokens,
};

export default crowdOwnedExchangeService;