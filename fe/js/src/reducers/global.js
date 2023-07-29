import {
  SET_GLOBAL_SETUP_STATE,
  SET_GLOBAL_NETWORTH_STATE,
} from "../actions/types";

const initialState = {
  setup: false,
  netWorth: [],
};

const globalReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_GLOBAL_SETUP_STATE:
      return {
        ...state,
        setup: payload,
      };
    case SET_GLOBAL_NETWORTH_STATE:
      return {
        ...state,
        netWorth: payload,
      };
    default:
      return state;
  }
};
export default globalReducer;
