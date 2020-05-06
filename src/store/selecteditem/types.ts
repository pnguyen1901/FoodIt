export const SET_ALERT = 'SET_ALERT';
export const SELECT_ITEM = 'SELECT_ITEM';
export const SET_EXPIRATION_DATE = 'SET_EXPIRATION_DATE';


export interface FoodItem {
    id: number | null,
    brand: string,
    category: string,
    expiration_date: Date | null,
    alert: string | 'None'
}

interface SelectedFoodItemAction {
    type: typeof SELECT_ITEM,
    foodItem: FoodItem
}

interface SetExpDateAction {
    type: typeof SET_EXPIRATION_DATE,
    expDate: FoodItem['expiration_date']
}

interface SetAlertAction {
    type: typeof SET_ALERT,
    alert: FoodItem['alert']
}

export type FoodItemActionTypes = SelectedFoodItemAction | SetExpDateAction | SetAlertAction ;