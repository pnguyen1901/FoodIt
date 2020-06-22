import {
    GET_CONTACTS,
    SET_NAME,
    SET_EMAIL,
    SET_PHONE_NUMBER,
    User,
    UserActionTypes
} from './types';

const initialState: User = {
    contacts: [],
    name: '',
    email: '',
    phoneNumber: ''
}

const userReducer = (
    state = initialState,
    action: UserActionTypes
) => {
    switch(action.type) {
        
        case GET_CONTACTS:
            return {
                ...state,
                contacts: action.payload
            }

        case SET_NAME:
            return {
                ...state,
                name: action.payload
            }

        case SET_EMAIL:
            return {
                ...state,
                email: action.payload
            }

        case SET_PHONE_NUMBER:
            return {
                ...state,
                phoneNumber: action.payload
            }

        default:
            return state
    }
}

export default userReducer;