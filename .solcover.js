require("dotenv").config();

module.exports = {
  client: require("ganache-cli"),
  providerOptions: {
    fork: process.env.RPC_URL,
    default_balance_ether: process.env.DEFAULT_BALANCE,
  },
  norpc: true,
  testCommand: "truffle test",
};
