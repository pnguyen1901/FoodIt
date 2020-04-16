import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer } from './rootReducers';
import { composeWithDevTools } from 'redux-devtools-extension';

// If RN app is not connecting to Redux Dev server try this
// On real device: Shake device & Click "Debug Remote JS".
// On Simulator: Try: Cmd or control + D on the Simulator & Click "Debug Remote JS".

export function configureStore(preloadedstate) {
    const store = createStore(
        rootReducer,
        composeWithDevTools(
            applyMiddleware(
                thunk
            )
        ),
        preloadedstate
    )

    return store
}