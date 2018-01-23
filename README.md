# crwd-prototype
Setting up the development environment for a prototype using Ethereum contracts with Truffle


## Local development environment
You first need to install node 8.x, follow the instructions at https://nodejs.org/en/download/package-manager/ depending on your OS

To be able to run a test ethereum environment locally, you need to install testrpc :
````
npm install -g ethereumjs-testrpc
````

Then run testrpc and leave it running:
````
testrpc
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

To start webpack development server (PORT 3000)
````
npm run start
````