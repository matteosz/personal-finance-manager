import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { convertCurrency } from "../objects/Currency";
import { CURRENCIES } from "../common/constants";
import { setupUser } from "../actions/user";

import * as FaIcons from "react-icons/fa";
import "./ComponentsStyles.css";
import { clearMessage } from "../actions/message";
import { setSetupState } from "../actions/global";

const Setup = () => {
  const { message } = useSelector((state) => state.message);
  const { user: userData } = useSelector((state) => state.user);
  const { setup } = useSelector((state) => state.global);

  const defEntry = userData.netWorth
    ? { amount: userData.netWorth.value, currency: "EUR" }
    : { amount: "", currency: "" };
  const [entries, setEntries] = useState([defEntry]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const exitSetup = () => {
    dispatch(setSetupState(false));
  };

  const handleChangeAmount = (e, index) => {
    const { value } = e.target;
    setEntries((prevEntries) => {
      const newEntries = [...prevEntries];
      newEntries[index].amount = value;
      return newEntries;
    });
  };

  const handleChangeCurrency = (e, index) => {
    const { value } = e.target;
    setEntries((prevEntries) => {
      const newEntries = [...prevEntries];
      newEntries[index].currency = value;
      return newEntries;
    });
  };

  const handleAddEntry = () => {
    setEntries((prevEntries) => [...prevEntries, { amount: "", currency: "" }]);
  };

  const handleRemoveEntry = (index) => {
    setEntries((prevEntries) => {
      const newEntries = [...prevEntries];
      newEntries.splice(index, 1);
      return newEntries;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const entriesEUR = entries.map((entry) => {
      return convertCurrency(
        userData.lastRates,
        parseFloat(entry.amount),
        entry.currency,
        "EUR",
        true
      );
    });

    dispatch(setupUser(entriesEUR.reduce((a, b) => a + b, 0.0)))
      .then(() => {
        setLoading(false);
        dispatch(clearMessage());
        dispatch(setSetupState(false));
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div className="setup-container">
      <div className="card">
        <div className="card-body">
          {!setup ? (
            <h2 className="card-title">Account Setup</h2>
          ) : (
            <div>
              <h2 className="card-title">Modify your initial Net Worth</h2>
              <p
                style={{
                  cursor: "pointer",
                  color: "blue",
                  textDecoration: "underline",
                }}
                onClick={exitSetup}
              >
                <FaIcons.FaArrowLeft /> Go back
              </p>
            </div>
          )}
          <br />
          <form className="setup-form" onSubmit={handleSubmit}>
            {entries.map((entry, index) => (
              <div key={index}>
                <div className="form-group">
                  <label htmlFor={`amount${index}`}>Net Worth</label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    className="form-control"
                    id={`amount${index}`}
                    value={entry.amount}
                    onChange={(e) => handleChangeAmount(e, index)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`currency${index}`}>Currency</label>
                  <select
                    className="form-control"
                    id={`currency${index}`}
                    value={entry.currency}
                    onChange={(e) => handleChangeCurrency(e, index)}
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
                {index > 0 && (
                  <div>
                    <button
                      type="button"
                      style={{ float: "right", marginTop: "10px" }}
                      className="btn btn-danger"
                      onClick={() => handleRemoveEntry(index)}
                    >
                      <FaIcons.FaTrash />
                    </button>
                  </div>
                )}
                <br />
              </div>
            ))}
            <div>
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: "30px" }}
                onClick={handleAddEntry}
              >
                <FaIcons.FaPlus /> Add Entry
              </button>
            </div>
            <br />
            <div style={{ position: "relative" }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  margin: "0",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  msTransform: "translate(-50%, -50%)",
                  transform: "translate(-50%, -50%)",
                }}
                disabled={loading}
              >
                {loading ? <div className="spinner"></div> : "Set up"}
              </button>
            </div>
            {message && (
              <div className="form-group">
                <br />
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
