import * as types from './types';

export function createItem (expiration_date) {
    return {
        type: types.CREATE_ITEM,
        expiration_date
    }
}


export function hideTimePicker () {
    return {
        type: types.HIDE_TIME_PICKER,
    }
}

export function showTimePicker () {
    return {
        type: types.SHOW_TIME_PICKER,
    }
}


export function loading () {
    return {
        type: types.IS_LOADING
    }
}

export function loadingDone () {
    return {
        type: types.IS_LOADING_DONE
    }
}

export function setLoggedIn (value) {
    return {
        type: types.SET_LOGGED_IN,
        value
    }
}

export function setDeleteItem (id) {
    return {
        type: types.SET_DELETE_ITEM,
        id
    }
}

export function removeDeleteItem () {
    return {
        type: types.REMOVE_DELETE_ITEM,
    }
}
