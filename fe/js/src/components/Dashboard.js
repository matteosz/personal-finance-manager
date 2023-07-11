import React from "react";
import { useSelector } from 'react-redux';
import { Alert } from "react-bootstrap";

import "./Dashboard.css";

const buildDashboard = (userData) => {
  // Structure the dashboard here
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <>
      <h3>Welcome {user.username}!</h3>
    </>
  );
};

const Dashboard = () => {
  const { message } = useSelector(state => state.message);
  const {user: userData} = useSelector(state => state.user);

  return (
    <div className="container centered">
      {message ? (
        <Alert variant="danger">{message}. Try to refresh the page...</Alert>
      ) : (
        <>
          {userData ? buildDashboard(userData) : <div className="spinner"></div>}
        </>
      )}
  </div>
  );
};

export default Dashboard;