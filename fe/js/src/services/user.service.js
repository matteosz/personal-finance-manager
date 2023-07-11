import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/test/";

const getUserBoard = () => {
  return axios.get(API_URL + "user", { headers: authHeader() });
};

const postUserSetup = (amount) => {
  return axios.post(API_URL + "user/setup", { amount }, { headers: authHeader() });
};

const service = {
    getUserBoard,
    postUserSetup,
};

export default service;