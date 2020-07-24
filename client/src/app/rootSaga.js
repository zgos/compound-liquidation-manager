import { all, fork } from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga';
import startUpSaga from '../saga/startUpSaga';
import transactionSaga from '../saga/transactionSaga';

function* rootSaga() {
  yield all(
    [
      fork(startUpSaga),
      fork(transactionSaga)
    ]
  );
};

const sagaMiddleware = createSagaMiddleware();

export const startSaga = () => {
  sagaMiddleware.run(rootSaga);
};

export default sagaMiddleware;
