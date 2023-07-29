import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/test/";

const getUserBoard = () => {
  return axios.get(API_URL + "user", { headers: authHeader() });
};

const postUserSetup = (entries, startDate) => {
  return axios.post(
    API_URL + "user/setup",
    { entries, startDate },
    { headers: authHeader() }
  );
};

const postUserAddExpense = (expense) => {
  return axios.post(API_URL + "user/expense/add", expense, {
    headers: authHeader(),
  });
};

const postUserAddIncome = (income) => {
  delete income.date;
  return axios.post(API_URL + "user/income/add", income, {
    headers: authHeader(),
  });
};

const postUserAddAsset = (asset) => {
  return axios.post(API_URL + "user/asset/add", asset, {
    headers: authHeader(),
  });
};

const postModifyExpense = (expense) => {
  return axios.post(API_URL + "user/expense/modify", expense, { headers: authHeader() });
};

const postModifyIncome = (income) => {
  return axios.post(API_URL + "user/income/modify", income, { headers: authHeader() });
};

const postModifyAsset = (asset) => {
  return axios.post(API_URL + "user/asset/modify", asset, { headers: authHeader() });
};

const service = {
  getUserBoard,
  postUserSetup,
  postUserAddExpense,
  postModifyExpense,
  postUserAddIncome,
  postModifyIncome,
  postUserAddAsset,
  postModifyAsset,
};

export default service;
