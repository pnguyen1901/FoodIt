import {
    SELECT_ITEM,
    SET_EXPIRATION_DATE,
    FoodItem
} from './types';
import { SET_ALERT } from '../types';

export function selectItem (foodItem: FoodItem) {
    return {
        type: SELECT_ITEM,
        foodItem
    }
}

export function setExpDate (expDate: Date) {
    return {
        type: SET_EXPIRATION_DATE,
        expDate
    }
}

export function setAlert (alert: string) {
    return {
        type: SET_ALERT,
        alert
    }
}