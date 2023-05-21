require("@nomiclabs/hardhat-ethers");

module.exports = {
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/5wqhpOjMlwrv9KQM-NzDZjli3RytlI93",
      accounts: [
        "540b02abd96e51829255a6c4b7e522ef040c7a9847ff6099cca972513fdd7838",
      ],
    },
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 40000,
  },
};
