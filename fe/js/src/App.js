import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Expense from "./components/Expenses";
import Income from "./components/Income";
import Setup from "./components/Setup";
import Assets from "./components/Assets";

import EventBus from "./common/EventBus";

import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";
import { getUsercontent } from "./actions/user";

const App = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const { user: userData } = useSelector((state) => state.user);
  const { setup } = useSelector((state) => state.global);

  const [userContentLoaded, setUserContentLoaded] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  let location = useLocation();

  const logOut = useCallback(() => {
    dispatch(logout());
    navigate("/login");
  }, [dispatch, navigate]);

  useEffect(() => {
    dispatch(clearMessage()); // clear message when changing location
  }, [dispatch, location]);

  useEffect(() => {
    if (currentUser && !userContentLoaded) {
      setUserContentLoaded(true);
      dispatch(getUsercontent()).catch(() => {
        EventBus.dispatch("logout");
      });
    }
  }, [currentUser, userContentLoaded, dispatch]);

  useEffect(() => {
    EventBus.on("logout", () => {
      logOut();
      setUserContentLoaded(false);
    });
    return () => {
      EventBus.remove("logout");
    };
  }, [logOut]);

  const setupOrElement = (element) => {
    if (currentUser && (setup || (userData && !userData.wallet))) {
      return <Setup />;
    } else {
      return element;
    }
  };

  return (
    <div>
      {currentUser && !setup && userData && userData.wallet && <Sidebar />}

      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={setupOrElement(<Dashboard />)} />
          <Route path="/expenses" element={setupOrElement(<Expense />)} />
          <Route path="/income" element={setupOrElement(<Income />)} />
          <Route path="/assets" element={setupOrElement(<Assets />)} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
