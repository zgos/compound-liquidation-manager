require("@openzeppelin/test-helpers/configure");
const { expect } = require("chai");
const {
  expectRevert,
  BN,
  ether,
  constants,
} = require("@openzeppelin/test-helpers");

const LiquidatorManagerHelper = require("./liquidatorManager.helper");
const tokenAddress = require("./helpers/TokenAddress");

const ERC20 = artifacts.require("ERC20");

contract("LiquidatorManager", (accounts) => {
  const admin = accounts[0];
  const liquidator = accounts[1];
  const borrower = accounts[2];

  describe("LiquidatorManager", () => {
    beforeEach(async () => {
      //setup swap contract
      this.liquidatorManagerHelper = new LiquidatorManagerHelper(
        admin,
        liquidator,
        borrower
      );

      const {
        swap,
        liquidatorManager,
      } = await this.liquidatorManagerHelper.initScenario();

      this.swap = swap;
      this.liquidatorManager = liquidatorManager;

      this.dai = await ERC20.at(tokenAddress.DAI);
      this.cdai = await ERC20.at(tokenAddress.CDAI);
      this.ceth = await ERC20.at(tokenAddress.CETH);
    });

    describe("deposit()", () => {
      it("should deposit tokens", async () => {
        const daiBalance = await this.dai.balanceOf(liquidator);

        //approve contract
        await this.dai.approve(this.liquidatorManager.address, daiBalance, {
          from: liquidator,
        });

        //deposit DAI
        this.liquidatorManager.deposit(tokenAddress.DAI, daiBalance, {
          from: liquidator,
        });

        const finalDaiBalance = await this.dai.balanceOf(liquidator);
        expect(finalDaiBalance).to.be.bignumber.eq(new BN("0"));
      });

      it("should deposit ethers", async () => {
        //deposit ETH
        this.liquidatorManager.deposit(tokenAddress.ETH_ADDRESS, ether("10"), {
          from: liquidator,
          value: ether("10"),
        });

        const depositedBalance = await this.liquidatorManager.balance(
          liquidator,
          tokenAddress.ETH_ADDRESS
        );
        expect(depositedBalance).to.be.bignumber.eq(ether("10"));
      });

      it("should update balance deposited to the contract", async () => {
        const daiBalance = await this.dai.balanceOf(liquidator);

        //approve contract
        await this.dai.approve(this.liquidatorManager.address, daiBalance, {
          from: liquidator,
        });

        //deposit DAI
        this.liquidatorManager.deposit(tokenAddress.DAI, daiBalance, {
          from: liquidator,
        });

        const depositedBalance = await this.liquidatorManager.balance(
          liquidator,
          tokenAddress.DAI
        );
        expect(depositedBalance).to.be.bignumber.eq(daiBalance);
      });

      it("should revert if ETH not sent when depositing Ethers", async () => {
        await expectRevert(
          this.liquidatorManager.deposit(
            tokenAddress.ETH_ADDRESS,
            ether("10"),
            {
              from: liquidator,
            }
          ),
          "Incorrect ETH amount"
        );
      });

      it("should revert if ERC tokens not approved", async () => {
        const daiBalance = await this.dai.balanceOf(liquidator);

        await expectRevert(
          this.liquidatorManager.deposit(tokenAddress.DAI, daiBalance, {
            from: liquidator,
          }),
          "Tokens not approved"
        );
      });
    });

    describe("withdraw()", () => {
      beforeEach(async () => {
        //deposit ETH
        this.liquidatorManager.deposit(tokenAddress.ETH_ADDRESS, ether("10"), {
          from: liquidator,
          value: ether("10"),
        });

        //deposit ERC (DAI)
        this.daiBalance = await this.dai.balanceOf(liquidator);
        await this.dai.approve(
          this.liquidatorManager.address,
          this.daiBalance,
          { from: liquidator }
        );

        this.liquidatorManager.deposit(tokenAddress.DAI, this.daiBalance, {
          from: liquidator,
        });
      });

      it("should withdraw the token deposited", async () => {
        const DAIToWithdraw = await this.daiBalance.div(new BN("2"));

        await this.liquidatorManager.withdraw(tokenAddress.DAI, DAIToWithdraw, {
          from: liquidator,
        });

        const depositedDAI = await this.liquidatorManager.balance(
          liquidator,
          tokenAddress.DAI
        );
        expect(depositedDAI).to.be.bignumber.lt(this.daiBalance);
      });

      it("should withdraw the ethers deposited", async () => {
        await this.liquidatorManager.withdraw(
          tokenAddress.ETH_ADDRESS,
          ether("1"),
          {
            from: liquidator,
          }
        );

        const depositedETH = await this.liquidatorManager.balance(
          liquidator,
          tokenAddress.ETH_ADDRESS
        );
        expect(depositedETH).to.be.bignumber.eq(ether("9"));
      });

      it("should update the number of tokens deposited after withdrawal", async () => {
        const initialDepositedDAI = await this.liquidatorManager.balance(
          liquidator,
          tokenAddress.DAI
        );

        const DAIToWithdraw = await this.daiBalance.div(new BN("2"));
        await this.liquidatorManager.withdraw(tokenAddress.DAI, DAIToWithdraw, {
          from: liquidator,
        });

        const finalDepositedDAI = await this.liquidatorManager.balance(
          liquidator,
          tokenAddress.DAI
        );

        const DAIAvailable = initialDepositedDAI.sub(DAIToWithdraw);
        expect(finalDepositedDAI).to.be.bignumber.eq(DAIAvailable);
      });

      it("should revert if amount exceeds deposited balance", async () => {
        await expectRevert(
          this.liquidatorManager.withdraw(
            tokenAddress.ETH_ADDRESS,
            ether("11"),
            {
              from: liquidator,
            }
          ),
          "Invalid withdrawal amount"
        );
      });
    });

    describe("withdrawCTokens()", () => {
      beforeEach(async () => {
        //deposit ETH
        this.liquidatorManager.deposit(tokenAddress.ETH_ADDRESS, ether("10"), {
          from: liquidator,
          value: ether("10"),
        });

        //deposit ERC (DAI)
        this.daiBalance = await this.dai.balanceOf(liquidator);
        await this.dai.approve(
          this.liquidatorManager.address,
          this.daiBalance,
          { from: liquidator }
        );

        this.liquidatorManager.deposit(tokenAddress.DAI, this.daiBalance, {
          from: liquidator,
        });
      });

      it("should withdraw deposited tokens as cToken", async () => {
        const DAIToWithdraw = await this.daiBalance.div(new BN("2"));

        const initialCDAIBal = await this.cdai.balanceOf(liquidator);

        await this.liquidatorManager.withdrawCTokens(
          tokenAddress.DAI,
          tokenAddress.CDAI,
          DAIToWithdraw,
          {
            from: liquidator,
          }
        );

        const finalCDAIBal = await this.cdai.balanceOf(liquidator);

        const depositedDAI = await this.liquidatorManager.balance(
          liquidator,
          tokenAddress.DAI
        );
        expect(depositedDAI).to.be.bignumber.lt(this.daiBalance);
        expect(initialCDAIBal).to.be.bignumber.lt(finalCDAIBal);
      });

      it("should withdraw deposited ethers as cETH", async () => {
        const initialCETHBal = await this.ceth.balanceOf(liquidator);

        await this.liquidatorManager.withdrawCTokens(
          tokenAddress.ETH_ADDRESS,
          tokenAddress.CETH,
          ether("1"),
          {
            from: liquidator,
          }
        );

        const finalCETHBal = await this.ceth.balanceOf(liquidator);

        const depositedETH = await this.liquidatorManager.balance(
          liquidator,
          tokenAddress.ETH_ADDRESS
        );
        expect(depositedETH).to.be.bignumber.eq(ether("9"));
        expect(initialCETHBal).to.be.bignumber.lt(finalCETHBal);
      });

      it("should update the number of tokens deposited after withdrawal", async () => {
        const initialDepositedDAI = await this.liquidatorManager.balance(
          liquidator,
          tokenAddress.DAI
        );

        const DAIToWithdraw = await this.daiBalance.div(new BN("2"));
        await this.liquidatorManager.withdrawCTokens(
          tokenAddress.DAI,
          tokenAddress.CDAI,
          DAIToWithdraw,
          {
            from: liquidator,
          }
        );

        const finalDepositedDAI = await this.liquidatorManager.balance(
          liquidator,
          tokenAddress.DAI
        );

        const DAIAvailable = initialDepositedDAI.sub(DAIToWithdraw);
        expect(finalDepositedDAI).to.be.bignumber.eq(DAIAvailable);
      });

      it("should revert if amount exceeds deposited balance", async () => {
        await expectRevert(
          this.liquidatorManager.withdrawCTokens(
            tokenAddress.ETH_ADDRESS,
            tokenAddress.CETH,
            ether("11"),
            {
              from: liquidator,
            }
          ),
          "Invalid withdrawal amount"
        );
      });
    });

    describe("updateComptrollerAddress()", () => {
      it("should revert if not called by owner", async () => {
        const newComptrollerAddress =
          "0xc00e94Cb662C3520282E6f5717214004A7f26888";
        await expectRevert(
          this.liquidatorManager.updateComptrollerAddress(
            newComptrollerAddress,
            {
              from: liquidator,
            }
          ),
          "Ownable: caller is not the owner"
        );
      });

      it("should revert if zero address is used", async () => {
        await expectRevert(
          this.liquidatorManager.updateComptrollerAddress(
            constants.ZERO_ADDRESS,
            {
              from: admin,
            }
          ),
          "Invalid comptroller address"
        );
      });

      it("should update comptroller address", async () => {
        const newComptrollerAddress =
          "0xc00e94Cb662C3520282E6f5717214004A7f26888";

        await this.liquidatorManager.updateComptrollerAddress(
          newComptrollerAddress,
          { from: admin }
        );

        const comptrollerAddress = await this.liquidatorManager.comptrollerAddress();
        assert.equal(newComptrollerAddress, comptrollerAddress);
      });
    });
  });
});
