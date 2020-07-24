import contractABI from '../contracts/LiquidatorManager.json';
import { contractAddress, tokenAddress } from '../constant';

class Contract {
  getInstance = async () => {
    const contract = new window.web3.eth.Contract(contractABI.abi, contractAddress);
    return contract;
  }

  getBalance = async (address, tokenAddress) => {
    try {
      const contractInstance = await this.getInstance();
      const balance = await contractInstance.methods.balance(address, tokenAddress).call()
      return balance
    } catch (error) {
      return new Error(error)
    }
  }

  deposit = async (address, amount, walletAddress) => {
    try {
      const contractInstance = await this.getInstance();
      if (address !== tokenAddress["ETH"][0]) {
        await contractInstance.methods.deposit(address, amount).send({
          from: walletAddress,
        })
      } else {
        await contractInstance.methods.deposit(address, amount).send({
          from: walletAddress,
          value: amount
        })
      }
    } catch (error) {
      return new Error(error)
    }
  }

  withdraw = async (address, amount, walletAddress) => {
    try {
      const contractInstance = await this.getInstance();
      if (address !== tokenAddress["ETH"][0]) {
        await contractInstance.methods.withdraw(address, amount).send({
          from: walletAddress,
        })
      } else {
        await contractInstance.methods.withdraw(address, amount).send({
          address,
          amount,
          from: walletAddress,
        })
      }
    } catch (error) {
      return new Error(error)
    }
  }
}

const contract = new Contract();
Object.freeze(contract);

export default contract;