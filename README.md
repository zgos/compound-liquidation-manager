# Perlin Test Task


## Solution

### Smart Contracts

Created a contract Liquidator Manager which maintains the assets of liquidators which can be used to:

- Deposit
- Withdraw
- Withdraw c tokens for the deposited asset
- Track assets deposited
- Repay Loan (by borrower or on its behalf)
- Liquidate borrowers account

It interacts with Compound Comptroller contract and C token contracts for various use cases.

The contract tests use open zeppelin testing environment and truffle suite for compiling and testing them.

The contract can be improved to get the rewards accumulated by the user on liquidity provided and redeem it.

The contract coverage can also be improved to get potential vulnerabilities.

### Backend Service

I was not able to work on the backend service due to a shortage of time. But here I'm describing how it would work

1. Use compound's AccountService get all accounts which can be liquidated, we can identify these accounts by their max_health which would be < 1.0
2. Start Liquidation, the process would be as follow
    1. Get the close factor from Comptroller contract & calculate the amount to seize
    2. call liquidate method from LiquidatorManager contract

We can continuously run step 1 after a specific interval to keep liquidating.

Of course, many scenarios need to be taken care of.
1. Optimize service to handle too many liquidations

**Solution Proposal:** We can create a background job for each liquidation. These jobs should be stored in a database so that we can avoid duplicate jobs. An in-memory database would also work, but we might need a system with larger RAM to handle these if there are too many accounts to be liquidated. We also need to do a lot of logging (especially for the failed jobs) as with asynchronous background jobs we can never be sure that if an account has sufficient balance or not.

2. In-necessary calls to Compound Account Service

**Solution Proposal:** We might run into a situation where there are no accounts to be liquidated for a long time and our service keeps requesting to AccountService. In this case, we can increase the interval between requests exponentially to some extent.
