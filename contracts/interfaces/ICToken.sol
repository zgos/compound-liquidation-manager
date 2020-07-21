pragma solidity 0.5.12;

interface ICToken {
    function underlying() external view returns (address);
    function mint(uint mintAmount) external returns (uint);
    function redeem(uint redeemTokens) external returns (uint);
    function liquidateBorrow(address borrower, uint amount, address collateral) external returns (uint);
    function repayBorrowBehalf(address borrower, uint repayAmount) external returns (uint);
}