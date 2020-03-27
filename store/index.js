import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer } from './rootReducer';

export function configureStore(preloadedstate) {
    const store = createStore(
        rootReducer,
        preloadedstate,
        applyMiddleware(
            thunk
        )
    )

    return store
}