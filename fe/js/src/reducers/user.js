import {
  CLEAR_USER,
  SET_USER_CONTENT,
  UPDATE_USER_NW,
  ADD_USER_EXPENSE,
  ADD_USER_INCOME,
  ADD_USER_ASSET,
  MODIFY_USER_EXPENSE,
  MODIFY_USER_INCOME,
} from "../actions/types";

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
    case MODIFY_USER_EXPENSE:
      return {
        ...state,
        user: {
          ...state.user,
          expenses: state.user.expenses
            .map((expense) => {
              if (expense.id === action.payload.id) {
                if (action.payload.toBeDeleted) {
                  return null;
                } else {
                  return action.payload; // Replace the item with the new expense
                }
              }
              return expense; // Keep the original expense item
            })
            .filter(Boolean), // Remove any null values from the expenses list
        },
      };
    case ADD_USER_EXPENSE:
      return {
        ...state,
        user: {
          ...state.user,
          expenses: [...state.user.expenses, ...action.payload],
        },
      };
      case MODIFY_USER_INCOME:
      return {
        ...state,
        user: {
          ...state.user,
          income: state.user.income
            .map((income) => {
              if (income.id === action.payload.id) {
                if (action.payload.toBeDeleted) {
                  return null;
                } else {
                  return action.payload;
                }
              }
              return income;
            })
            .filter(Boolean),
        },
      };
    case ADD_USER_INCOME:
      return {
        ...state,
        user: {
          ...state.user,
          income: [...state.user.income, ...action.payload],
        },
      };
    case ADD_USER_ASSET:
      return {
        ...state,
        user: {
          ...state.user,
          assets: [...state.user.assets, action.payload],
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
