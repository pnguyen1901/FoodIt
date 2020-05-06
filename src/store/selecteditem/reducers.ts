import {
    SELECT_ITEM,
    SET_EXPIRATION_DATE,
    SET_ALERT,
    FoodItemActionTypes,
    FoodItem
} from './types';

const initialState: FoodItem = {
    id: null,
    brand: '',
    category: '',
    expiration_date: null,
    alert: ''
}

const selectedItemReducer = (
    state = initialState,
    action: FoodItemActionTypes
) => {
    switch (action.type) {
        
        case SELECT_ITEM:
            return {
                id: action.foodItem.id,
                brand: action.foodItem.brand,
                category: action.foodItem.category,
                expiration_date: action.foodItem.expiration_date
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


        default:
            return state
    }
}

export default selectedItemReducer;
