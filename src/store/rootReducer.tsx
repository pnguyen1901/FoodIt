import { combineReducers } from 'redux';
import { itemReducer } from './reducers';
import selectedItemReducer from './selecteditem/reducers';
import additemReducer from './item/reducers';

export default rootReducer = combineReducers({
    itemReducer,
    selectedItem: selectedItemReducer,
    addItem: additemReducer
})

export type RootState = ReturnType<typeof rootReducer>;