import errorsSaga from './errorsSaga';
import web3Saga from './web3Saga';
import {fork} from 'redux-saga/effects'

export const runSagas = (sagaMiddleware) => {
  function* rootSaga() {
    yield fork(web3Saga);
    yield fork(errorsSaga);
  }

  sagaMiddleware.run(rootSaga);
};