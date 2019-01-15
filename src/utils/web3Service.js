import Web3 from 'web3'

let getWeb3 = () => new Promise(function (resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', function () {
    let web3 = window.web3;

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider);
      web3.currentProvider.setMaxListeners(300);
      console.log('Injected web3 detected.');
    } else if (process.env.NODE_ENV === "development") {
      // Fallback to localhost if no web3 injection.
      let provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(provider);
      console.log('No web3 instance injected, using Local web3.');
    }
    else {
      return reject(new Error('No web3 instance injected.'));
    }

    web3.eth.getAccounts((err, accounts) => {
      if (err) {
        return reject(err);
      }

      let currentAccount = accounts[0];
      web3.eth.defaultAccount = accounts[0];
      console.log('Using account:', web3.eth.defaultAccount);


      // poll for metamask account change => refresh page
      setInterval(function () {
        web3.eth.getAccounts((err, accounts) => {
          if (accounts[0] !== currentAccount) {
            window.location.reload();
          }
        });
      }, 500);


      let networkName;
      web3.eth.net.getId()
        .then((networkId) => {
          switch (networkId) {
            case "1":
              networkName = "Main";
              break;
            case "2":
              networkName = "Morden";
              break;
            case "3":
              networkName = "Ropsten";
              break;
            case "4":
              networkName = "Rinkeby";
              break;
            case "42":
              networkName = "Kovan";
              break;
            default:
              networkName = "Unknown";
          }

          if (networkName === "Unknown" && parseInt(networkId, 10) > 0) {
            networkName = "Private"
          }

          if (process.env.NODE_ENV === "development") {
            // assign to window vars for debugging
            window.debugVars.web3 = web3;
          }

          resolve({ web3, networkName });
        }).catch((err) => {
          reject(err);
        }
      );
    });
  });
});

function getEventLogs(contractInstance, eventName, filter = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      let logs = await contractInstance.getPastEvents(eventName, { filter, fromBlock: 0, toBlock: 'latest' });
      resolve(logs);
    }
    catch (err) {
      return reject(err);
    }
  })
}

let web3Service = {
  getWeb3: getWeb3,
  getEventLogs: getEventLogs
};


export default web3Service;
