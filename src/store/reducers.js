import * as types from './types';
import * as actions from './actions';
import initialState from './initialState';
require('datejs'); 

export const itemReducer = (state = initialState, action) => {
    switch (action.type) {

        case types.CREATE_ITEM:
            return {
                ...state,
                expiration_date: Date.parse(action.expiration_date),
                isLoading: false
            }
        
        case types.SET_BRAND:
            return {
                ...state,
                brand: action.brand
            }

        case types.SET_CATEGORY:
            return {
                ...state,
                category: action.category
            }

        case types.SET_ALERT:
            return {
                ...state,
                alert: action.alert
            }

        case types.SET_EXP:
            return {
                ...state,
                expiration_date: action.expiration_date
            }

        case types.SET_TIME:
            return {
                ...state,
                time: action.time,
                isTimePickerVisible: false
            }

        case types.SHOW_TIME_PICKER:
            return {
                ...state,
                isTimePickerVisible: true
            }

        case types.HIDE_TIME_PICKER:
            return {
                ...state,
                isTimePickerVisible: false
            }

        case types.IS_LOADING:
            return {
                isLoading: true
            }
        
        case types.IS_LOADING_DONE:
            return {
                isLoading: false
            }
        
        case types.RESET_FORM:
            return initialState

        case types.SET_LOGGED_IN:
            return {
                ...state,
                loggedIn: action.value
            }

        case types.SET_DELETE_ITEM:
            return {
                ...state,
                deleteItem: action.id
            }

        case types.REMOVE_DELETE_ITEM:
            return {
                ...state,
                deleteItem: ''
            }


        default:
            return state
    }
}