// Describe the available actions
export const GET_CONTACTS = 'GET_CONTACTS';
export const SET_NAME = 'SET_NAME';
export const SET_EMAIL = 'SET_EMAIL';
export const SET_PHONE_NUMBER = 'SET_PHONE_NUMBER';

export interface User {
    contacts: Array<object>,
    name: string,
    email: string,
    phoneNumber: string
}

interface GetContactsAction {
    type: typeof GET_CONTACTS,
    payload: User['contacts']
}

interface SetNameAction {
    type: typeof SET_NAME,
    payload: User['name']
}

interface SetEmailAction {
    type: typeof SET_EMAIL,
    payload: User['email']
}

interface SetPhoneNumberAction {
    type: typeof SET_PHONE_NUMBER,
    payload: User['phoneNumber']
}

export type UserActionTypes = GetContactsAction | SetNameAction | SetEmailAction | SetPhoneNumberAction;