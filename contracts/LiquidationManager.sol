pragma solidity 0.5.12;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

import "./interfaces/IComptroller.sol";
import "./interfaces/ICToken.sol";

contract LiquidityManagement {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

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
