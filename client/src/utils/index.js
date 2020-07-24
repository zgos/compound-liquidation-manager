const Web3 = require('web3');

export const isMetamaskInstalled = () => {
  return !!window.ethereum || !!window.web3;
}

export const initializeWeb3 = async () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    window.ethereum.autoRefreshOnNetworkChange = false;
  } else {
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }
}

export const askPermission = async () => {
  try {
    await window.ethereum.enable();
  } catch (error) {
    throw error;
  }
}

export const getAccountAddress = async () => {
  const [address] = await window.web3.eth.getAccounts();
  return address
}

export const getNetworkName = () => {
  return window.web3.eth.net.getNetworkType()
}
