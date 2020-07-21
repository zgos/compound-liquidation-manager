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

    mapping(address => mapping(address => uint256)) public balance;

    event AmountDeposited(address token, uint256 amount);
    event AmountWithdrawn(address token, uint256 amount);

    function updateComptrollerAddress(address _comptrollerAddress) public {
        require(
            comptrollerAddress != address(0),
            "Invalid comptroller address"
        );
        comptrollerAddress = _comptrollerAddress;
    }

    function deposit(address token, uint256 amount) public {
        require(token != address(0), "Invalid Token address");
        require(amount > 0, "Invalid token amount");

        uint256 allowance = IERC20(token).allowance(address(this), msg.sender);
        require(allowance >= amount, "Tokens not approved");

        balance[msg.sender][token] = balance[msg.sender][token].add(amount);

        IERC20(token).transferFrom(msg.sender, address(this), amount);

        emit AmountDeposited(token, amount);
    }

    function withdraw(address token, uint256 amount) public {
        require(token != address(0), "Invalid Token address");
        require(amount > 0, "Invalid token amount");

        require(
            balance[msg.sender][token] >= amount,
            "Invalid withdrawal amount"
        );

        balance[msg.sender][token] = balance[msg.sender][token].sub(amount);

        IERC20(token).transfer(msg.sender, amount);

        emit AmountWithdrawn(token, amount);
    }

    function withdrawCTokens(
        address token,
        address cToken,
        uint256 amount
    ) public returns (uint256 tokensMinted) {
        require(token != address(0), "Invalid Token address");
        require(amount > 0, "Invalid token amount");

        require(
            balance[msg.sender][token] >= amount,
            "Invalid withdrawal amount"
        );
        balance[msg.sender][token] = balance[msg.sender][token].sub(amount);

        //approve
        IERC20(token).approve(cToken, amount);

        uint256 initialCTokenBalance = IERC20(cToken).balanceOf(address(this));

        //mint cToken
        require(ICToken(cToken).mint(amount) == 0, "Error in redeeming tokens");

        tokensMinted = IERC20(cToken).balanceOf(address(this)).sub(
            initialCTokenBalance
        );

        IERC20(cToken).transfer(msg.sender, tokensMinted);

        emit AmountWithdrawn(cToken, amount);
    }
}
