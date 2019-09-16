# crwd-prototype
Smart contracts for crowd ownership. This prototype leverages Ethereum contracts for ownership of real estate by a group of individuals. It provides a solution for:

* ownership: tokens and exchange
* finance: rental income
* management: voting right based on tokens in your wallet
* legal: ownership can be restricted to a closed group, supervised by a notary

## Acknowledgements
This project is the result of R&D activities financed by the Blandlord company.
The project received a grant from [the SIDN Foundation](https://www.sidnfonds.nl/projecten/be-a-social-landlord) under the Blockchain for Good track.

## Developer instructions
Setting up the development environment for a prototype using Ethereum contracts with Truffle

### Local development environment
You first need to install node 8.x, follow the [package manager instructions](https://nodejs.org/en/download/package-manager/) for your OS

To be able to run a test ethereum environment locally, you need to install ganache-cli :
````
npm install -g ganache-cli
````

Then run ganache-cli and leave it running:
````
ganache-cli
````

Install the truffle cli 
````
npm install -g truffle
````

Install packages
````
npm install
````


Copy the truffle config example file truffle.js.example to truffle.js
````
cp truffle.js.example truffle.js
````

To compile and deploy the contracts locally:
````
truffle migrate
````

To run tests
````
truffle test
````

To load demo data
````
truffle exec truffle-scripts/demo-init.js
````

To start webpack development server (PORT 3000). The development server must be restarted whenever the contracts are recompiled
````
npm run start
````
