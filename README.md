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




