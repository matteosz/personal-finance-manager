import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';

import UserService from "../services/user.service";

const Dashboard = () => {
  const [content, setContent] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    UserService.getUserBoard().then(
      (response) => {
        const data = response.data;
        dispatch({ type: 'SET_RATES', payload: data.lastRates });
        dispatch({ type: 'SET_USER_STATE', payload: {'networth' : data.amountEUR, } });
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setContent(_content);
      }
    );
  }, [dispatch]);

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
    </div>
  );
};

export default Dashboard;