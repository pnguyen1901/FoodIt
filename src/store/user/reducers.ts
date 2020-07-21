import {
    GET_CONTACTS,
    SET_NAME,
    SET_EMAIL,
    SET_PHONE_NUMBER,
    SET_PASSWORD,
    PASSWORD_VISIBLE,
    RESET_SIGNUP_FORM,
    User,
    UserActionTypes
} from './types';
import undoable from 'redux-undo';


const initialState: User = {
    contacts: [],
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    showPassword: false
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

        case PASSWORD_VISIBLE:
            return {
                ...state,
                showPassword: !state.showPassword
            }

        case SET_PHONE_NUMBER:
            return {
                ...state,
                phoneNumber: action.payload
            }

        case SET_PASSWORD:
            return {
                ...state,
                password: action.payload
            }
        
        case RESET_SIGNUP_FORM:
            return {
                ...state,
                name: '',
                email: '',
                password: '',
                phoneNumber: ''
            }

        default:
            return state
    }
}

const undoableUser = undoable(userReducer)

export default undoableUser;