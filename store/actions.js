import * as types from './types';

export function createItem (props) {
    return {
        type: types.CREATE_ITEM,
        props
    }
}