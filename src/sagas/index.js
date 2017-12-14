import {fork} from 'redux-saga/effects'

import errorsSaga from './errorsSaga';
import web3Saga from './web3Saga';
import registrySaga from './registrySaga';
import crowdOwnedSaga from './crowdOwnedSaga';
import crowdOwnedExchangeSaga from './crowdOwnedExchangeSaga';


export const runSagas = (sagaMiddleware) => {
  function* rootSaga() {
    yield fork(web3Saga);
    yield fork(registrySaga);
    yield fork(crowdOwnedSaga);
    yield fork(crowdOwnedExchangeSaga);
    yield fork(errorsSaga);
  }

  sagaMiddleware.run(rootSaga);
};