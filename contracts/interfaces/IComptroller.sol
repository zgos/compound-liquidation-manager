pragma solidity 0.5.12;

interface IComptroller {
    function getAccountLiquidity(address account)
        external
        view
        returns (
            uint256,
            uint256,
            uint256
        );

    function markets(address cTokenAddress)
        external
        view
        returns (bool, uint256);

    function closeFactorMantissa() external view returns (uint256);

    function liquidationIncentiveMantissa() external view returns (uint256);
}
