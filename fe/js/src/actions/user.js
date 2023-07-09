import { SET_USER_CONTENT, UPDATE_USER_CONTENT } from "./types";

export const setUserContent = (userData) => {
    return {
        type: SET_USER_CONTENT,
        payload: userData,
    };
};

export const updateUserContent = (updatedFields) => {
    return {
        type: UPDATE_USER_CONTENT,
        payload: updatedFields,
    };
};