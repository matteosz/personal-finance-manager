import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import Sidebar from "./components/Sidebar";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import EventBus from "./common/EventBus";

import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";

const App = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const { user: userData } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  let location = useLocation();

  const logOut = useCallback(() => {
    dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);

  useEffect(() => {
    if (["/login", "/register"].includes(location.pathname)) {
      dispatch(clearMessage()); // clear message when changing location
    }
    
    EventBus.on("logout", () => {
        logOut();
      });

    return () => {
      EventBus.remove("logout");
    };
  }, [dispatch, location, logOut]);

  return (
    <div>
      {currentUser && userData && <Sidebar />}

      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/home" element={<Dashboard />} />
        </Routes>
      </div>

    </div>
  );
};

export default App;
