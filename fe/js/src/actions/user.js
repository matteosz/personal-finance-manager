import { SET_USER_CONTENT, SET_USER_CONTENT_FAIL, SET_MESSAGE, UPDATE_USER_NW } from "./types";
import UserService from "../services/user.service";

export const getUsercontent = () => (dispatch) => {
    return UserService.getUserBoard().then(
        (response) => {
            dispatch({
                type: SET_USER_CONTENT,
                payload: response.data,
            });
            return Promise.resolve();
        },
        (error) => {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            dispatch({
                type: SET_USER_CONTENT_FAIL,
            });
    
            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });
    
            return Promise.reject();
        }
    );
};

export const setupUser = (amount) => (dispatch) => {
    return UserService.postUserSetup(amount).then(
        (response) => {
            dispatch({
                type: UPDATE_USER_NW,
                payload: response.data,
            });
            return Promise.resolve();
        },
        (error) => {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
    
            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });
    
            return Promise.reject();
        }
    );
};