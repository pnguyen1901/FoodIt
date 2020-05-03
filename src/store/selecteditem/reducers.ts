import {
    SELECT_ITEM,
    SET_EXPIRATION_DATE,
    FoodItemActionTypes,
    FoodItem
} from './types';

const initialState: FoodItem = {
    id: null,
    brand: '',
    category: '',
    expiration_date: null
}

const selectedItem = (
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

        default:
            return state
    }
}

export default selectedItem;
