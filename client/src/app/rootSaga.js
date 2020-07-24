import { all, fork } from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga';
import startUpSaga from '../saga/startUpSaga';

function* rootSaga() {
  yield all(
    [
      fork(startUpSaga)
    ]
  );
};

const sagaMiddleware = createSagaMiddleware();

export const startSaga = () => {
  sagaMiddleware.run(rootSaga);
};

export default sagaMiddleware;
