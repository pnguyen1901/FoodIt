import {
    GET_CONTACTS,
    User,
    UserActionTypes
} from './types';

const initialState: User = {
    contacts: []
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

        default:
            return state
    }
}

export default userReducer;