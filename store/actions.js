import * as types from './types';

export function createItem (expiration_date) {
    return {
        type: types.CREATE_ITEM,
        expiration_date
    }
}