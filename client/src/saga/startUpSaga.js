import { put, call, takeEvery } from 'redux-saga/effects';
import { initializeWeb3, isMetamaskInstalled, getNetworkName, askPermission, getAccountAddress } from '../utils/index';
import { updateNetwork, updateUserAddress, updateBalance } from "../reducer/userReducer";
import contract from '../contractInterface';
import { tokenAddress } from '../constant';

function* startSaga() {
  try {
    const isMetamask = isMetamaskInstalled();
    if (isMetamask) {
      initializeWeb3()
      yield askPermission()
      const address = yield getAccountAddress()
      yield put(updateUserAddress(address))
      const network = yield getNetworkName()
      yield put(updateNetwork(network));
      yield call(updateContractBalance, { payload: { address } })
    } else {
      console.log('No provider found')
    }
  } catch (error) {
    console.log(error)
  }
};

function* updateContractBalance(action) {
  try {
    for (let index = 0; index < Object.keys(tokenAddress).length; index++) {
      const balance = yield contract.getBalance(action.payload.address, Object.values(tokenAddress)[index][0])
      yield put(updateBalance({ [Object.keys(tokenAddress)[index]]: parseInt(balance) / 10 ** Object.values(tokenAddress)[index][1] }))
    }
  } catch (error) {
    console.log(error)
  }
}

function* startupSaga() {
  yield call(startSaga);
  yield takeEvery('UPDATE_BALANCE', updateContractBalance)
}

export default startupSaga;