import { SET_USER_CONTENT, UPDATE_USER_CONTENT } from "../actions/types";

const initialState = {
    user: {
        rates: [],
        networth: null,
        expenses: [],
        income: [],
        assets: [],
    },
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_CONTENT:
        return {
            ...state,
            user: action.payload,
        };
        case UPDATE_USER_CONTENT:
        return {
            ...state,
            user: {
            ...state.user,
            ...action.payload,
            },
        };
        default:
        return state;
    }
};

export default userReducer;