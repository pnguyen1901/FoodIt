import { combineReducers } from 'redux';
import cameraReducer from './camera/reducers';
import itemReducer from './item/reducers';
import userReducer from './user/reducers';

export const rootReducer = combineReducers({
    item: itemReducer,
    camera: cameraReducer,
    user: userReducer
})

export type RootState = ReturnType<typeof rootReducer>;