import { SET_USER_CONTENT, SET_USER_CONTENT_FAIL, SET_MESSAGE, UPDATE_USER_NW, CLEAR_USER, ADD_USER_EXPENSE, MODIFY_USER_EXPENSE } from "./types";
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
                payload: response.data.netWorth,
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

export const addExpense = (expense) => (dispatch) => {
    return UserService.postUserAddExpense(expense).then(
        (response) => {
            dispatch({
                type: ADD_USER_EXPENSE,
                payload: response.data.expense,
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

export const modifyExpense = (expense, del = false) => (dispatch) => {
    const payload = {
        expense: expense,
        delete: del,
    }
    return UserService.postModifyExpense(payload).then(
        (response) => {
            dispatch({
                type: MODIFY_USER_EXPENSE,
                payload: response.data.expense,
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

export const clearUser = () => (dispatch) => {
    dispatch({
        type: CLEAR_USER,
    });
};