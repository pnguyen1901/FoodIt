import {
    IS_LOADING,
    IS_LOADING_DONE,
    Camera,
    CameraActionTypes
} from './types';


const initialState = {
    isLoading: false,
}

const cameraReducer = (
    state=initialState,
    action: CameraActionTypes
) => {
    switch(action.type) {
        case IS_LOADING:
            return {
                ...state,
                isLoading: true
            }

        case IS_LOADING_DONE:
            return {
                ...state,
                isLoading: false
            }

        default:
            return state
    }
}

export default cameraReducer;