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

To compile and deploy the contracts locally:
````
truffle migrate
````

To run tests
````
truffle test
````

