import { SET_GLOBAL_FINANCIAL_STATE, SET_GLOBAL_SETUP_STATE } from "../actions/types";

const initialState = {
  finance: {
    netWorth: null,
    expenses: [],
    income: [],
    assets: [],
    rates: {},
    dates: [],
  },
  setup: false,
};

const globalReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_GLOBAL_FINANCIAL_STATE:
      return {
        ...state,
        finance: payload,
      };
      case SET_GLOBAL_SETUP_STATE:
      return {
        ...state,
        setup: payload,
      };
    default:
      return state;
  }
};
export default globalReducer;
