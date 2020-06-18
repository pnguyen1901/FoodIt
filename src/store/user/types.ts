// Describe the available actions
export const GET_CONTACTS = 'GET_CONTACTS';

export interface User {
    contacts: Array<object>
}

interface GetContactsAction {
    type: typeof GET_CONTACTS,
    payload: User['contacts']
}

export type UserActionTypes = GetContactsAction;