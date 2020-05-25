import {
    FoodItem,
    SELECT_ITEM,
    CANCEL_ADD_ITEM,
    SET_DELETE_ITEM,
    REMOVE_DELETE_ITEM,
    SET_ALERT,
    SET_EXPIRATION_DATE,
    SET_BRAND,
    SET_CATEGORY,
    SET_NOTES,
    RESET_FORM
} from './types';

export function selectItem (foodItem: FoodItem) {
    return {
        type: SELECT_ITEM,
        foodItem
    }
}

export function cancelAddItem () {
    return {
        type: CANCEL_ADD_ITEM
    }
}

export function setDeleteItem (id: FoodItem['id']) {
    return {
        type: SET_DELETE_ITEM,
        id
    }
}

export function removeDeleteItem () {
    return {
        type: REMOVE_DELETE_ITEM,
    }
}

export function resetForm () {
    return {
        type: RESET_FORM
    }
}

export function setExpDate (expDate: FoodItem['expiration_date']) {
    return {
        type: SET_EXPIRATION_DATE,
        expDate
    }
}

export function setAlert (alert: FoodItem['alert']) {
    return {
        type: SET_ALERT,
        alert
    }
}

export function setBrand (brand: FoodItem['brand']) {
    return {
        type: SET_BRAND,
        brand
    }
}

export function setCategory (category: FoodItem['category']) {
    return {
        type: SET_CATEGORY,
        category
    }
}

export function setNotes (notes: FoodItem['notes']) {
    return {
        type: SET_NOTES,
        notes
    }
}