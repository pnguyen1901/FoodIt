import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { AppearanceProvider } from 'react-native-appearance';
// If RN app is not connecting to Redux Dev server try this
// On real device: Shake device & Click "Debug Remote JS".
// On Simulator: Try: Cmd or control + D on the Simulator & Click "Debug Remote JS".

// export function configureStore(preloadedstate) {
//     const store = createStore(
//         rootReducer,
//         composeWithDevTools(
//             applyMiddleware(
//                 thunk
//             )
//         ),
//         preloadedstate
//     )

//     return store
// }

import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { ItemFilter } from '../store/item/reducers';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
// import createSagaMiddleware from 'redux-saga';

import { rootReducer } from './rootReducer';
// import saga from './rootSaga';

// Using merge level 2 to keep properties of the initial state while still overlay the value of initial state with stored value.
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    stateReconciler: autoMergeLevel2,
    whitelist: ['item'],
    transforms: [ItemFilter]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// const sagaMiddleware = createSagaMiddleware();

const store = createStore(
    persistedReducer,
    //reducer,
    composeWithDevTools(
        applyMiddleware(
            thunk,
            )
    ),
);
const persistor = persistStore(store);
if (process.env.NODE_ENV !== 'production') {
    module.hot.accept('./rootReducer', () => store.replaceReducer(persistedReducer))
}
//setTimeout(() => persistor.purge(), 200)

// sagaMiddleware.run(saga);

export const withReduxProvider = (C) => (props) => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
        <AppearanceProvider>
            <C {...props}/>            
        </AppearanceProvider>
        </PersistGate>
    </Provider>
);