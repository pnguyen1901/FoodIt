// Describe all actions available
export const IS_LOADING = 'IS_LOADING';
export const IS_LOADING_DONE = 'IS_LOADING_DONE';

export interface Camera {
    isLoading: boolean
}


interface loadingAction {
    type: typeof IS_LOADING
}

interface loadingDoneAction {
    type: typeof IS_LOADING_DONE
}

export type CameraActionTypes = loadingAction | loadingDoneAction;