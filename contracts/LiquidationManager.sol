pragma solidity 0.5.12;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

import "./interfaces/IComptroller.sol";
import "./interfaces/ICToken.sol";

contract LiquidityManagement is Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    address public comptrollerAddress = address(
        0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B
    );

    address private constant ETHAddress = address(
        0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE
    );

    mapping(address => mapping(address => uint256)) public balance;

    event AmountDeposited(address token, uint256 amount);
    event AmountWithdrawn(address token, uint256 amount);
    event AccountLiquidated(
        address borrower,
        address liquidator,
        address assetSeized,
        uint256 amountSeized
    );
    event AmountRepaid(address borrower, address payer, uint256 amount);

    function updateComptrollerAddress(address _comptrollerAddress)
        public
        onlyOwner
    {
        require(
            comptrollerAddress != address(0),
            "Invalid comptroller address"
        );
        comptrollerAddress = _comptrollerAddress;
    }

    function deposit(address token, uint256 amount) public payable {
        require(token != address(0), "Invalid Token address");
        require(amount > 0, "Invalid token amount");

        if (token == ETHAddress) {
            require(msg.value == amount, "Incorrect ETH amount");
            return _depositETH(msg.value);
        }

        uint256 allowance = IERC20(token).allowance(address(this), msg.sender);
        require(allowance >= amount, "Tokens not approved");

        balance[msg.sender][token] = balance[msg.sender][token].add(amount);

        IERC20(token).transferFrom(msg.sender, address(this), amount);

        emit AmountDeposited(token, amount);
    }

    function _depositETH(uint256 amount) internal {
        balance[msg.sender][ETHAddress] = balance[msg.sender][ETHAddress].add(
            amount
        );
        emit AmountDeposited(ETHAddress, amount);
    }

    function withdraw(address token, uint256 amount) public {
        require(token != address(0), "Invalid Token address");
        require(amount > 0, "Invalid token amount");

        require(
            balance[msg.sender][token] >= amount,
            "Invalid withdrawal amount"
        );

        balance[msg.sender][token] = balance[msg.sender][token].sub(amount);

        if (token == ETHAddress) {
            msg.sender.transfer(amount);
        } else {
            IERC20(token).transfer(msg.sender, amount);
        }

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

        uint256 initialCTokenBalance = IERC20(cToken).balanceOf(address(this));

        //mint cToken
        if (token == ETHAddress) {
            ICEther(cToken).mint.value(amount)();
        } else {
            //approve
            IERC20(token).approve(cToken, amount);
            require(
                ICToken(cToken).mint(amount) == 0,
                "Error in redeeming tokens"
            );
        }

        tokensMinted = IERC20(cToken).balanceOf(address(this)).sub(
            initialCTokenBalance
        );

        IERC20(cToken).transfer(msg.sender, tokensMinted);

        emit AmountWithdrawn(cToken, amount);
    }

    function isLiquidityNegative() public view returns (bool) {
        (, , uint256 shortfall) = IComptroller(comptrollerAddress)
            .getAccountLiquidity(msg.sender);
        if (shortfall > 0) return true;

        return false;
    }

    //amount in underlying asset terms
    function repayBorrowedAsset(
        address borrower,
        address cToken,
        uint256 repayAmount
    ) public {
        address underlyingToken = ICToken(cToken).underlying();
        require(
            balance[msg.sender][underlyingToken] >= repayAmount,
            "Insufficient deposit"
        );

        balance[msg.sender][underlyingToken] = balance[msg
            .sender][underlyingToken]
            .sub(repayAmount);

        //approve
        IERC20(underlyingToken).approve(cToken, repayAmount);

        //repay
        if (borrower == msg.sender) {
            require(
                ICToken(cToken).repayBorrow(repayAmount) == 0,
                "Error in repay"
            );
        } else {
            require(
                ICToken(cToken).repayBorrowBehalf(borrower, repayAmount) == 0,
                "Error in repay"
            );
        }

        emit AmountRepaid(borrower, msg.sender, repayAmount);
    }

    //amount in underlying asset terms
    function liquidate(
        address borrower,
        address collateral,
        address borrowedAsset,
        uint256 amount
    ) public returns (uint256 collateralSeized) {
        address underlyingAsset = ICToken(borrowedAsset).underlying();
        require(
            balance[msg.sender][underlyingAsset] >= amount,
            "Insufficient deposit"
        );

        uint256 collateralInitialbalance = IERC20(collateral).balanceOf(
            address(this)
        );
        balance[msg.sender][underlyingAsset] = balance[msg
            .sender][underlyingAsset]
            .sub(amount);

        //approve
        IERC20(underlyingAsset).approve(borrowedAsset, amount);

        //liquidate
        require(
            ICToken(borrowedAsset).liquidateBorrow(
                borrower,
                amount,
                collateral
            ) == 0,
            "Error in repay"
        );

        //transfer seized collateral to liquidator
        uint256 collateralFinalbalance = IERC20(collateral).balanceOf(
            address(this)
        );
        collateralSeized = collateralFinalbalance.sub(collateralInitialbalance);

        IERC20(collateral).transfer(msg.sender, collateralSeized);

        emit AccountLiquidated(
            borrower,
            msg.sender,
            collateral,
            collateralSeized
        );
    }
}
