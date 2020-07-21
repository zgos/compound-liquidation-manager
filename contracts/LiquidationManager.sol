pragma solidity 0.5.12;

import "./interfaces/IComptroller.sol";
import "./interfaces/ICToken.sol";

contract LiquidityManagement {
    address public comptrollerAddress = address(
        0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B
    );

    mapping(address => mapping(address => uint256)) public balance; //user addr -> token address -> token deposited

    event AmountDeposited(address token, uint256 amount);
    event AmountWithdrawn(address token, uint256 amount);

    function updateComptrollerAddress(address _comptrollerAddress) public {
        require(
            comptrollerAddress != address(0),
            "Invalid comptroller address"
        );
        comptrollerAddress = _comptrollerAddress;
    }

    function deposit(address token, uint256 amount) public {}

    function withdraw(address token, uint256 amount) public {}

    function withdrawCTokens(
        address token,
        address cToken,
        uint256 amount
    ) public returns (uint256 tokensMinted) {}
}
