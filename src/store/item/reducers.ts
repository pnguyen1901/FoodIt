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
    RESET_FORM,
    TURN_ON_SEARCH_MODE,
    TURN_OFF_SEARCH_MODE,
    TOGGLE_ACTION_SHEET,
    SAVE_SEARCH_KEY
} from './types';
import { createFilter  } from 'redux-persist-transform-filter';

const initialState: FoodItem = {
    id: null,
    brand: '',
    category: '',
    expiration_date: new Date(),
    alert: {
        text: '1 day before',
        value: 1
    },
    notes: '',
    eventId: '',
    searchMode: false,
    showActionSheet: false,
    algoliaSearchKey: null
}


export const ItemFilter = createFilter(
    'item',
    ['algoliaSearchKey']
)

const itemReducer = (
    state = initialState,
    action: addItemActionTypes
) => {
    switch(action.type) {

        case SELECT_ITEM:
            return {
                ...state,
                id: action.foodItem.id,
                brand: action.foodItem.brand,
                category: action.foodItem.category,
                notes: action.foodItem.notes,
                expiration_date: action.foodItem.expiration_date,
                alert: action.foodItem.alert,
                eventId: action.foodItem.eventId
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

        case TURN_ON_SEARCH_MODE:
            return {
                ...state,
                searchMode: true
            }

        case TURN_OFF_SEARCH_MODE:
            return {
                ...state,
                searchMode: false
            }

        case TOGGLE_ACTION_SHEET:
            return {
                ...state,
                showActionSheet: !state.showActionSheet
            }
        
        case SAVE_SEARCH_KEY:
            return {
                ...state,
                algoliaSearchKey: action.key
            }

        default: 
            return state
    }
}

export default itemReducer;