require("@nomiclabs/hardhat-waffle");

const infuraApiKey = "472fabf7fd0b4e8c9292084ab5d933ce";
const mnemonic =
  "giggle gap stick diet pill broom move sock pottery evidence dice outdoor";

module.exports = {
  networks: {
    mainnet: {
      url: `https://mainnet.infura.io/v3/${infuraApiKey}`,
      accounts: { mnemonic: mnemonic },
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
};
