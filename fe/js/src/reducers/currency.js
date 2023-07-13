import { SET_CURRENCY } from "../actions/types";

const initialState = {currency: 'EUR'};

const currencyReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case SET_CURRENCY:
        return { currency: payload };

        default:
        return state;
    }
};
export default currencyReducer;