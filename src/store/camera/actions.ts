import {
    IS_LOADING,
    IS_LOADING_DONE
} from './types';

export function loading () {
    return {
        type: IS_LOADING
    }
}

export function loadingDone () {
    return {
        type: IS_LOADING_DONE
    }
}