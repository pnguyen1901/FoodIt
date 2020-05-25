import {
    FoodItem,
    SELECT_ITEM,
    SET_DELETE_ITEM,
    REMOVE_DELETE_ITEM,
    SET_CATEGORY,
    SET_BRAND,
    SET_EXPIRATION_DATE,
    SET_ALERT,
    addItemActionTypes,
    CANCEL_ADD_ITEM,
    SET_NOTES,
    RESET_FORM
} from './types';

const initialState: FoodItem = {
    id: null,
    brand: '',
    category: '',
    expiration_date: new Date(),
    alert: {
        text: '1 day before',
        value: 1
    },
    notes: ''
}

const additemReducer = (
    state = initialState,
    action: addItemActionTypes
) => {
    switch(action.type) {

        case SELECT_ITEM:
            return {
                id: action.foodItem.id,
                brand: action.foodItem.brand,
                category: action.foodItem.category,
                notes: action.foodItem.notes,
                expiration_date: action.foodItem.expiration_date,
                alert: action.foodItem.alert
            }

        case SET_DELETE_ITEM:
            return {
                ...state,
                deleteItem: action.id
            }

        case REMOVE_DELETE_ITEM:
            return {
                ...state,
                deleteItem: ''
            }

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

        case SET_NOTES:
            return {
                ...state,
                notes: action.notes
            }

        case CANCEL_ADD_ITEM:
            return initialState

        case RESET_FORM:
            return initialState
        
        default: 
            return state
    }
}

export default additemReducer;