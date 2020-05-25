// Describe the available actions.
export const CANCEL_ADD_ITEM = 'CANCEL_ADD_ITEM';
export const SET_ALERT = 'SET_ALERT';
export const SET_EXPIRATION_DATE = 'SET_EXPIRATION_DATE';
export const SET_BRAND = 'SET_BRAND';
export const SET_CATEGORY = 'SET_CATEGORY';
export const RESET_FORM = 'RESET_FORM';
export const SET_NOTES = 'SET_NOTES';
export const SELECT_ITEM = 'SELECT_ITEM';
export const SET_DELETE_ITEM = 'SET_DELETE_ITEM';
export const REMOVE_DELETE_ITEM = 'REMOVE_DELETE_ITEM';

// Describe how the add item slice of the app state should look like.
export interface alert {
    text: string,
    value: number
}

export interface FoodItem {
    id: number | null,
    brand: string,
    category: string,
    expiration_date: Date | null,
    alert: alert,
    notes: string 
}

// Describe how the add item actions should look like.
interface SelectedFoodItemAction {
    type: typeof SELECT_ITEM,
    foodItem: FoodItem
}

interface SetDeleteItemAction {
    type: typeof SET_DELETE_ITEM
}

interface RemoveItemAction {
    type: typeof REMOVE_DELETE_ITEM
}

interface CancelAddItemAction {
    type: typeof CANCEL_ADD_ITEM
}

interface ResetFormAction {
    type: typeof RESET_FORM
}

interface SetBrandAction {
    type: typeof SET_BRAND,
    brand: FoodItem['brand']
}

interface SetCategoryAction {
    type: typeof SET_CATEGORY,
    category: FoodItem['category']
}

interface SetExpDateAction {
    type: typeof SET_EXPIRATION_DATE,
    expDate: FoodItem['expiration_date']
}

interface SetAlertAction {
    type: typeof SET_ALERT,
    alert: FoodItem['alert']
}

interface SetNoteAction {
    type: typeof SET_NOTES,
    notes: FoodItem['notes']
}

export type addItemActionTypes = SelectedFoodItemAction | SetDeleteItemAction | RemoveItemAction |
CancelAddItemAction | ResetFormAction | SetBrandAction | 
SetCategoryAction |  SetExpDateAction | SetAlertAction | SetNoteAction;