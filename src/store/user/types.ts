// Describe the available actions
export const GET_CONTACTS = 'GET_CONTACTS';
export const SET_NAME = 'SET_NAME';
export const SET_EMAIL = 'SET_EMAIL';
export const SET_PHONE_NUMBER = 'SET_PHONE_NUMBER';
export const SET_PASSWORD = 'SET_PASSWORD';
export const PASSWORD_VISIBLE = 'PASSWORD_VISIBLE';

export interface User {
    contacts: Array<object>,
    name: string,
    email: string,
    phoneNumber: string,
    password: string,
    showPassword: boolean
}

interface GetContactsAction {
    type: typeof GET_CONTACTS,
    payload: User['contacts']
}

interface SetPasswordAction {
    type: typeof SET_PASSWORD,
    payload: User['password']
}

interface SetPasswordVisibleAction {
    type: typeof PASSWORD_VISIBLE,
    payload: User['showPassword']
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

export type UserActionTypes = GetContactsAction | SetPasswordAction | SetPasswordVisibleAction | SetNameAction | SetEmailAction | SetPhoneNumberAction;