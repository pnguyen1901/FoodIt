import {
    FoodItem,
    SET_CATEGORY,
    SET_BRAND,
    SET_EXPIRATION_DATE,
    SET_ALERT,
    addItemActionTypes,
    CANCEL_ADD_ITEM
} from './types';

const initialState: FoodItem = {
    brand: '',
    category: '',
    expiration_date: new Date(),
    alert: ''
}

const additemReducer = (
    state = initialState,
    action: addItemActionTypes
) => {
    switch(action.type) {

        case SET_BRAND:
            return {
                ...state,
                brand: action.brand
            }

        case SET_CATEGORY:
            return {
                ...state,
                category: action.category
            }

        case SET_EXPIRATION_DATE:
            return {
                ...state,
                expiration_date: action.expDate
            }

        case SET_ALERT:
            return {
                ...state,
                alert: action.alert
            }

        case CANCEL_ADD_ITEM:
            return state
        
        default: 
            return state
    }
}

export default additemReducer;