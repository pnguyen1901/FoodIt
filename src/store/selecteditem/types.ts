export const SELECT_ITEM = 'SELECT_ITEM';
export const SET_EXPIRATION_DATE = 'SET_EXPIRATION_DATE';

// =================
// ACTIONS
// =================

export interface FoodItem {
    id: number | null,
    brand: string,
    category: string,
    expiration_date: Date | null
}

interface SelectedFoodItemAction {
    type: typeof SELECT_ITEM,
    foodItem: FoodItem
}

interface SetExpDateAction {
    type: typeof SET_EXPIRATION_DATE,
    expDate: Date
}

export type FoodItemActionTypes = SelectedFoodItemAction | SetExpDateAction ;