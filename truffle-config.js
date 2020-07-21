const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
    coverage: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
  },
  plugins: ["solidity-coverage"],
  mocha: {
    reporter: "eth-gas-reporter",
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.5.12", // Fetch exact version from solc-bin (default: truffle's version)
      settings: {
        // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 500,
        },
      },
      evmVersion: "petersburg",
    },
  },
};
