import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useLocation } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import DashboardUser from "./components/DashboardUser";
import Income from './pages/Income';
import Expenses from './pages/Expense';
import Assets from './pages/Assets';
import Settings from './pages/Settings';

import { clearMessage } from "./actions/message";
import Sidebar from "./components/Sidebar";

const App = () => {
  const { user: currentUser } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();

  let location = useLocation();

  useEffect(() => {
    if (["/login", "/register"].includes(location.pathname)) {
      dispatch(clearMessage()); // clear message when changing location
    }
  }, [dispatch, location]);

  return (
    <div>
      {currentUser ? <Sidebar /> : <Login />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard_user" element={<DashboardUser />} />
        <Route path='/expenses' element={<Expenses />} />  
        <Route path='/income' element={<Income />} />
        <Route path='/assets' element={<Assets />} />
        <Route path='/settings' element={<Settings />} />
      </Routes>
    </div>
  );
};

export default App;