import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer } from './rootReducers';

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