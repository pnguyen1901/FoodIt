import {
    User,
    UserActionTypes,
    GET_CONTACTS
} from './types';

export function getContacts (payload: UserActionTypes['payload']) {
    return {
        type: GET_CONTACTS,
        payload
    }
}