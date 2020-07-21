pragma solidity 0.5.12;

interface IComptroller {
    function getAccountLiquidity(address account) view external returns (uint, uint, uint); // account liquidity
    function markets(address cTokenAddress) view external returns (bool, uint);     // close factor for given ctoken
    function closeFactorMantissa() view external returns (uint);     // how much could be closed
    function liquidationIncentiveMantissa() view external returns (uint); //% of incentive on each unit received after liquidating (maintained by comp)
}