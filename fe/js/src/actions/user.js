import {
  SET_USER_CONTENT,
  SET_USER_CONTENT_FAIL,
  SET_MESSAGE,
  CLEAR_USER,
  ADD_USER_EXPENSE,
  ADD_USER_INCOME,
  MODIFY_USER_EXPENSE,
  MODIFY_USER_INCOME,
  MODIFY_USER_ASSET,
  ADD_USER_ASSET,
  SET_USER_WALLET,
} from "./types";
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

export const setupUser = (entries, date) => (dispatch) => {
  const aggregatedEntries = entries.reduce((result, entry) => {
    const { amount, currency } = entry;
    if (result.hasOwnProperty(currency)) {
      result[currency] += parseFloat(amount);
    } else {
      result[currency] = parseFloat(amount);
    }
    return result;
  }, {});
  return UserService.postUserSetup(aggregatedEntries, date).then(
    (response) => {
      dispatch({
        type: SET_USER_WALLET,
        payload: response.data.wallet,
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

export const addIncome = (income) => (dispatch) => {
  return UserService.postUserAddIncome(income).then(
    (response) => {
      dispatch({
        type: ADD_USER_INCOME,
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

export const addAsset = (asset) => (dispatch) => {
  return UserService.postUserAddAsset(asset).then(
    (response) => {
      dispatch({
        type: ADD_USER_ASSET,
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

export const modifyExpense =
  (expense, del = false) =>
  (dispatch) => {
    const payload = {
      expense: expense,
      delete: del,
    };
    return UserService.postModifyExpense(payload).then(
      (response) => {
        dispatch({
          type: MODIFY_USER_EXPENSE,
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

export const modifyIncome =
  (income, del = false) =>
  (dispatch) => {
    const payload = {
      income,
      delete: del,
    };
    return UserService.postModifyIncome(payload).then(
      (response) => {
        dispatch({
          type: MODIFY_USER_INCOME,
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

export const modifyAsset =
  (asset, del = false) =>
  (dispatch) => {
    const payload = {
      asset,
      delete: del,
    };
    return UserService.postModifyAsset(payload).then(
      (response) => {
        dispatch({
          type: MODIFY_USER_ASSET,
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

export const clearUser = () => (dispatch) => {
  dispatch({
    type: CLEAR_USER,
  });
};
