import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from "react-bootstrap";

import "./Dashboard.css";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";

const buildDashboard = (userData) => {
  // Structure the dashboard here
  return (
    <>
      <h3>Welcome, {userData.username}!</h3>
    </>
  );
};

const Dashboard = () => {
  const [error, setError] = useState(null);
  const userData = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    UserService.getUserBoard().then(
      (response) => {
        const data = response.data;
        dispatch({ type: 'SET_RATES', payload: data.lastRates });
        dispatch({ type: 'SET_USER_STATE', payload: {'networth' : data.amountEUR, } });
      },
      (error) => {
          setError(
            (error.response && error.response.data && error.response.data.message) ||
              error.message ||
              error.toString()
          );
          if (error.response && error.response.status === 401) {
            EventBus.dispatch("logout");
          }
      }
    );
  }, [dispatch]);

  return (
    <div className="container centered">
      {error ? (
        <Alert variant="danger">{error}. Try to refresh the page...</Alert>
      ) : (
        <>
          {userData ? buildDashboard(userData) : <div className="spinner"></div>}
        </>
      )}
  </div>
  );
};

export default Dashboard;