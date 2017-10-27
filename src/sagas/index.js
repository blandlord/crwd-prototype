import errorsSaga from './errorsSaga';
import web3Saga from './web3Saga';
import registrySaga from './registrySaga';
import {fork} from 'redux-saga/effects'

export const runSagas = (sagaMiddleware) => {
  function* rootSaga() {
    yield fork(web3Saga);
    yield fork(registrySaga);
    yield fork(errorsSaga);
  }

  sagaMiddleware.run(rootSaga);
};