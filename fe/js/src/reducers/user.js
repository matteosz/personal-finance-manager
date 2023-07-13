import { CLEAR_USER, SET_USER_CONTENT, UPDATE_USER_NW } from "../actions/types";

const initialState = {};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_CONTENT:
        return {
            ...state,
            user: action.payload,
        };
        case UPDATE_USER_NW:
        return {
            ...state,
            user: {
                ...state.user,
                netWorth: action.payload,
            },
        };
        case CLEAR_USER:
        return {
            ...state,
            user: null,
        };
        default:
        return state;
    }
};

export default userReducer;