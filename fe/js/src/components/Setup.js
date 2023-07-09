import React, { useState } from "react";

import { NetWorth } from "../objects/Networth";
import { useDispatch, useSelector } from "react-redux";

import { CURRENCIES } from "../objects/Currency";

import UserService from "../services/user.service";
import { updateUserContent } from "../actions/user";

import "./Dashboard.css";

const Setup = () => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {user: userData} = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    UserService.postUserSetup(parseFloat(amount), currency)
      .then((response) => {
        // Dispatch the info to user
        const newNetworth = NetWorth({rates: userData.lastRates, value: parseFloat(amount), currency: currency, date: response.date});
        dispatch(updateUserContent({ netWorth: newNetworth }));
        setLoading(false);
      })
      .catch((error) => {
        setError('Failed to set up account. Please try again' + error);
        setLoading(false);
      });
  };

  return (
    <div className="setup-container">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">Account Setup</h2>
          <br></br>
          <form className="setup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="amount">Net Worth</label>
              <input
                type="number"
                step="0.5"
                className="form-control"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="currency">Currency</label>
              <select
                className="form-control"
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                required
              >
                <option value="">Select Currency</option>
                {Object.keys(CURRENCIES).map((currencyCode) => (
                  <option key={currencyCode} value={currencyCode}>
                    {currencyCode}
                  </option>
                ))}
              </select>
            </div>
            <br></br>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ?  <div className="spinner"></div> : "Set up"}
            </button>
            {error && (
                <div className="form-group">
                    <br></br>
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Setup;