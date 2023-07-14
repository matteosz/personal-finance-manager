import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/Login";
import Setup from "./components/Setup";
import Register from "./components/Register";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Expense from "./components/Expenses";
import Income from "./components/Income";
import Assets from "./components/Assets";

import EventBus from "./common/EventBus";

import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";
import { getUsercontent } from "./actions/user";
import { FormattedDate } from "./objects/FormattedDate"
import { setGlobalFinancialState } from "./actions/global";

const MONTHS_FROM_MS = 30 * 24 * 60 * 60 * 1000;

const App = () => {
  const { user: currentUser } = useSelector(state => state.auth);
  const { user: userData } = useSelector(state => state.user);

  const [userContentLoaded, setUserContentLoaded] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  let location = useLocation();

  const logOut = useCallback(() => {
    dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);

  useEffect(() => {
    if (["/login", "/register", "/home"].includes(location.pathname)) {
      dispatch(clearMessage()); // clear message when changing location
    }
  }, [dispatch, location]);

  useEffect(() => {
    if (currentUser && !userContentLoaded) {
      setUserContentLoaded(true);
      dispatch(getUsercontent())
        .catch(() => {
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

  // Compute the global data for the user for each month (global history) every time the data changes
  useEffect(() => {
    if (userData) {
      const { lastRates, netWorth, expenses, income, assets } = userData;

      const startDate = new Date(netWorth.startDate);
      const currentDate = new Date(); 
      const maxMonths = Math.floor((currentDate - startDate) / MONTHS_FROM_MS);

      const bucketDates = [];
      const bucketedNetWorth = [];
      const bucketedExpenses = [];
      const bucketedIncome = [];
      const bucketedAssets = [];

      const initialYear = startDate.getFullYear();
      const initialMonth = startDate.getMonth();
      for (let i = 0; i <= maxMonths; ++i) {
        const year = initialYear + Math.floor(i / 12);
        const month = (initialMonth + i ) % 12;

        const currentMonth = new Date(year, month);
        const formattedDate = FormattedDate(currentMonth);
        bucketDates.push(formattedDate);
  
        const monthExpenses = expenses
        .filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate.getFullYear() === year && expenseDate.getMonth() === month;
        })
        .map((expense) => parseFloat(expense.amount))
        .reduce((a, b) => a + b, .0);

        bucketedExpenses.push(monthExpenses);
  
        const monthIncome = income.filter((income) => {
          const incomeDate = new Date(income.date);
          return incomeDate.getFullYear() === year && incomeDate.getMonth() === month;
        })
        .map((expense) => parseFloat(expense.amount))
        .reduce((a, b) => a + b, .0);

        bucketedIncome.push(monthIncome);

        const monthAssets = assets.reduce((a, b) => {
          const monthAssetValueA = parseFloat(a.pricesByDate[formattedDate]) || .0;
          const monthAssetValueB = parseFloat(b.pricesByDate[formattedDate]) || .0;
          return monthAssetValueA + monthAssetValueB;
        }, 0);

        bucketedAssets.push(monthAssets);

        const netSum = netWorth.value + monthIncome - monthExpenses + monthAssets;
        bucketedNetWorth.push(netSum);
      }

      dispatch(setGlobalFinancialState({ 
        rates: lastRates,
        dates: bucketDates,
        netWorth: bucketedNetWorth,
        expenses: bucketedExpenses,
        income: bucketedIncome,
        assets: bucketedAssets,
      }));
    }
  }, [userData, dispatch]);

  const setupOrElement = (element) => {
    if (currentUser && userData && !userData.netWorth) {
      return <Setup />;
    } else {
      return element;
    }
  };

  return (
    <div>
      {currentUser && userData && userData.netWorth && <Sidebar />}

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
