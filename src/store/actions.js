import * as types from './types';

export function createItem (expiration_date) {
    return {
        type: types.CREATE_ITEM,
        expiration_date
    }
}

export function setAlert (alert) {
    return {
        type: types.SET_ALERT,
        alert
    }
}

export function setBrand (brand) {
    return {
        type: types.SET_BRAND,
        brand
    }
}

export function setCategory (category) {
    return {
        type: types.SET_CATEGORY,
        category
    }
}

export function setEXP (expiration_date) {
    return {
        type: types.SET_EXP,
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

export function setTime (time) {
    return {
        type: types.SET_TIME,
        time
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

export function resetForm () {
    return {
        type: types.RESET_FORM
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