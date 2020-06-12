import { combineReducers } from 'redux';
import cameraReducer from './camera/reducers';
import itemReducer from './item/reducers';

export const rootReducer = combineReducers({
    item: itemReducer,
    camera: cameraReducer
})

export type RootState = ReturnType<typeof rootReducer>;