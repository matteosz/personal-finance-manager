import { SET_GLOBAL_FINANCIAL_STATE } from "../actions/types";

const initialState = {
    finance: {
        netWorth: null,
        expenses: [],
        income: [],
        assets: [],
        rates: {},
        dates: [],
    },
};

const globalReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case SET_GLOBAL_FINANCIAL_STATE:
        return {
            ...state,
            finance: payload,
        };
        default:
        return state;
    }
};
export default globalReducer;