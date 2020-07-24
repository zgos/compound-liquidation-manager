import { put, call, takeEvery, select } from 'redux-saga/effects';
import erc20Contract from '../contracts/ERC20.json';
import liquiditorManager from '../contractInterface';
import { contractAddress, tokenAddress } from '../constant';

function* transactionSaga() {
  yield takeEvery('DEPOSIT_TRANSACTION', depositTransaction);
  yield takeEvery('WITHDRAW_TRANSACTION', withdrawTransaction);

}

function* depositTransaction(action) {
  try {
    const walletAddress = yield select((state) => state.userReducer.userAddress)
    const contract = new window.web3.eth.Contract(erc20Contract.abi, action.payload.contractAddress);
    if (action.payload.contractAddress !== tokenAddress["ETH"][0]) {
      yield contract.methods.approve(contractAddress, action.payload.amount).send({
        from: walletAddress,
      })
    }
    yield liquiditorManager.deposit(action.payload.contractAddress, action.payload.amount, walletAddress)
    yield put({ type: 'UPDATE_BALANCE', payload: { address: walletAddress } })
  } catch (error) {
    console.log(error)
  }
};

function* withdrawTransaction(action) {
  try {
    const walletAddress = yield select((state) => state.userReducer.userAddress)
    const contract = new window.web3.eth.Contract(erc20Contract.abi, action.payload.contractAddress);
    if (action.payload.contractAddress !== tokenAddress["ETH"][0]) {
      yield contract.methods.approve(contractAddress, action.payload.amount).send({
        from: walletAddress,
      })
    }
    yield liquiditorManager.withdraw(action.payload.contractAddress, action.payload.amount, walletAddress)
    yield put({ type: 'UPDATE_BALANCE', payload: { address: walletAddress } })
  } catch (error) {
    console.log(error)
  }
};

export default transactionSaga;
