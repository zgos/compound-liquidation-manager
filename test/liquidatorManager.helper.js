const { BN, ether } = require("@openzeppelin/test-helpers");

const LiquidatorManager = artifacts.require("LiquidatorManager");
const Swap = artifacts.require("Swap");

const tokenAddress = require("./helpers/TokenAddress");

class LiquidatorManagerHelper {
  constructor(_admin, _liquidator, _borrower) {
    this.admin = _admin;
    this.liquidator = _liquidator;
    this.borrower = _borrower;
  }

  async initScenario() {
    await this.deployContract();

    await this.buyTokens(this.liquidator);
    await this.buyTokens(this.borrower);

    return {
      swap: this.swap,
      liquidatorManager: this.liquidatorManager,
    };
  }

  async deployContract() {
    this.liquidatorManager = await LiquidatorManager.new({
      from: this.admin,
    });

    this.swap = await Swap.new({
      from: this.admin,
    });
  }

  async buyTokens(buyer) {
    //get USDC tokens
    await this.swap.ethToToken(tokenAddress.USDC, {
      from: buyer,
      value: ether("10"),
    });

    //get DAI tokens
    await this.swap.ethToToken(tokenAddress.DAI, {
      from: buyer,
      value: ether("10"),
    });
	}
}

module.exports = LiquidatorManagerHelper;
