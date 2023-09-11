import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getFirstDate } from "../objects/Currency";
import { CURRENCIES } from "../common/constants";
import { setupUser } from "../actions/user";

import * as FaIcons from "react-icons/fa";
import "./ComponentsStyles.css";
import { clearMessage } from "../actions/message";
import { setGlobalSetupState } from "../actions/global";
import { FormattedDate } from "../objects/FormattedDate";

const Setup = () => {
  const { message } = useSelector((state) => state.message);
  const { user: userData } = useSelector((state) => state.user);
  const { setup } = useSelector((state) => state.global);

  const defEntry = [[{ amount: "", currency: "" }], ""];
  const [entries, setEntries] = useState(defEntry[0]);
  const [startDate, setStartDate] = useState(defEntry[1]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const exitSetup = () => {
    dispatch(setGlobalSetupState(false));
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

  const handleChangeDate = (e) => {
    const { value } = e.target;
    setStartDate(value);
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

    dispatch(setupUser(entries, startDate))
      .then(() => {
        setLoading(false);
        dispatch(clearMessage());
        dispatch(setGlobalSetupState(false));
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
            <div>
              <h2 className="card-title">Account Setup</h2>
              <h4>Set your initial cash availability</h4>
            </div>
          ) : (
            <div>
              <div>
                <h2 className="card-title">Modify account setup</h2>
                <h4>Modify your initial cash availability</h4>
              </div>
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
            <div className="form-group">
              <label htmlFor={`date`}>Start date of tracking</label>
              <input
                type="date"
                min={
                  userData
                    ? getFirstDate(userData.lastRates)
                    : FormattedDate(new Date())
                }
                max={
                  defEntry[1] === "" ? FormattedDate(new Date()) : defEntry[1]
                }
                className="form-control"
                id="start-date"
                value={startDate}
                onChange={handleChangeDate}
                required
              />
            </div>
            {entries.map((entry, index) => (
              <div key={index}>
                <div className="form-group">
                  <label htmlFor={`amount${index}`}>Amount</label>
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
