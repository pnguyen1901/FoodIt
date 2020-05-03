import { combineReducers } from 'redux';
import { itemReducer } from './reducers';
import selectedItem from './selecteditem/reducers';

export default rootReducer = combineReducers({
    itemReducer,
    selectedItem
})

export type RootState = ReturnType<typeof rootReducer>;