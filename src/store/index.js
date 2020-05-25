import thunk from 'redux-thunk';
import { rootReducer } from './rootReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import { ThemeContext, themes } from '../components/Theme/Theme';
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
// import createSagaMiddleware from 'redux-saga';

import reducer from './rootReducer';
// import saga from './rootSaga';

const persistConfig = {
    key: 'rootKeyPersist',
    storage: AsyncStorage,
};
// const persistedReducer = persistReducer(persistConfig, reducer);

// const sagaMiddleware = createSagaMiddleware();

const store = createStore(
    // persistedReducer,
    reducer,
    composeWithDevTools(
        applyMiddleware(
            thunk,
            )
    ),
);
// const persistor = persistStore(store);

// sagaMiddleware.run(saga);

export const withReduxProvider = (C: React.FC) => (props: any) => (
    <Provider store={store}>
        {/* <PersistGate loading={null} persistor={persistor}> */}
        <AppearanceProvider>
            {/* <ThemeContext.Provider> */}
                <C {...props}/>            
            {/* </ThemeContext.Provider>             */}
        </AppearanceProvider>
        {/* </PersistGate> */}
    </Provider>
);