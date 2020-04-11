import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer } from './rootReducers';

export function configureStore(preloadedstate) {
    const store = createStore(
        rootReducer,
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
        preloadedstate,
        applyMiddleware(
            thunk
        )
    )

    return store
}