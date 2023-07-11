import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { CURRENCIES, convertCurrency } from "../objects/Currency";
import { setupUser } from "../actions/user";

import "./Dashboard.css";

const Setup = () => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [loading, setLoading] = useState(false);

  const { message } = useSelector(state => state.message);
  const {user: userData} = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const amountEUR = convertCurrency(userData.lastRates, parseFloat(amount), currency, "EUR");

    dispatch(setupUser(amountEUR))
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
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
                step="0.01"
                min={0}
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
            {message && (
                <div className="form-group">
                    <br></br>
                    <div className="alert alert-danger" role="alert">
                        {message}
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