pragma solidity 0.5.12;

interface IuniswapFactory {
    function getExchange(address token)
        external
        view
        returns (address exchange);
}

interface IuniswapExchange {
    function ethToTokenSwapInput(uint256 min_tokens, uint256 deadline)
        external
        payable
        returns (uint256 tokens_bought);

    function ethToTokenTransferInput(
        uint256 min_tokens,
        uint256 deadline,
        address recipient
    ) external payable returns (uint256 tokens_bought);
}

contract Swap {
    IuniswapFactory public UniSwapFactoryAddress = IuniswapFactory(
        0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95
    );

    function ethToToken(address _ToTokenContractAddress) external payable {
				require(_ToTokenContractAddress != address(0), "Invalid token address");
        IuniswapExchange uniswapExchange = IuniswapExchange(
            UniSwapFactoryAddress.getExchange(_ToTokenContractAddress)
        );
        uniswapExchange.ethToTokenTransferInput.value(msg.value)(
            1,
            now + 1800,
            msg.sender
        );
    }
}
