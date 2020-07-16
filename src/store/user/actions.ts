import {
    User,
    UserActionTypes,
    GET_CONTACTS,
    SET_PHONE_NUMBER,
    SET_EMAIL,
    SET_NAME,
    SET_PASSWORD,
    PASSWORD_VISIBLE
} from './types';

export function getContacts (payload: UserActionTypes['payload']) {
    return {
        type: GET_CONTACTS,
        payload
    }
}

export function setName (payload: UserActionTypes['payload']) {
    return {
        type: SET_NAME,
        payload
    }
}

export function setEmail (payload: UserActionTypes['payload']) {
    return {
        type: SET_EMAIL,
        payload
    }
}

export function setPhoneNumber (payload: UserActionTypes['payload']) {
    return {
        type: SET_PHONE_NUMBER,
        payload
    }
}

export function setPassword (payload: UserActionTypes['payload']) {
    return {
        type: SET_PASSWORD,
        payload
    }
}

export function setPasswordVisibilty () {
    return {
        type: PASSWORD_VISIBLE,
    }
}