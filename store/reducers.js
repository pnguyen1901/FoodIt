import * as types from './types';
import * as actions from './actions';
import initialState from './initialState'; 

export const itemReducer = (state = initialState, action) => {
    switch (action.type) {

        case types.CREATE_ITEM:
            return {
                ...state,
                expiration_date: action.props.expiration_date
            }

        default:
            return state
    }
}