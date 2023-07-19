import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Alert, Card, Col, Container, Row } from "react-bootstrap";
import Plot from "react-plotly.js";

import { convertCurrency } from "../objects/Currency";
import { CURRENCIES, MONTHS_TIMESPAN_NW as MONTHS } from "../common/constants";

import "./ComponentsStyles.css";

const Dashboard = () => {
  const { message } = useSelector((state) => state.message);
  const { user: userData } = useSelector((state) => state.user);
  const { currency: selectedCurrency } = useSelector((state) => state.currency);
  const {
    finance: {
      rates: globalRates,
      dates: globalDates,
      netWorth: globalNetWorthData,
      expenses: globalExpenseData,
      income: globalIncomeData,
      assets: globalAssetsData,
    },
  } = useSelector((state) => state.global);

  const prevSelectedCurrency = useRef(selectedCurrency);

  const [timespan, setTimespan] = useState("3M");

  const [plottedNetWorthData, setPlottedNetWorthData] = useState([]);

  // Compute the data to be plotted as a slice of the global history whenever the timespan changes
  useEffect(() => {
    if (globalDates.length > 0) {
      // Compute the data to be plotted based on the selected timespan
      const timespanMonths = Math.min(MONTHS[timespan], globalDates.length);

      const timespanDates = globalDates.slice(-timespanMonths);
      var timespanNetWorthData = globalNetWorthData.slice(-timespanMonths);
      var timespanExpenseData = globalExpenseData.slice(-timespanMonths);
      var timespanIncomeData = globalIncomeData.slice(-timespanMonths);
      var timespanAssetsData = globalAssetsData.slice(-timespanMonths);

      // Convert the amounts plotted whenever the selected currency changes
      const oldSelectedCurrency = prevSelectedCurrency.current;
      if (oldSelectedCurrency !== selectedCurrency) {
        prevSelectedCurrency.current = selectedCurrency;

        const newNetworthData = [];
        const newExpenseData = [];
        const newIncomeData = [];
        const newAssetsData = [];
        for (let i = 0; i < timespanMonths; ++i) {
          const date = timespanDates[i];
          const rate = globalRates[date];

          newNetworthData.push(
            convertCurrency(
              rate,
              timespanNetWorthData[i],
              "EUR",
              selectedCurrency
            )
          );
          newExpenseData.push(
            convertCurrency(
              rate,
              timespanExpenseData[i],
              "EUR",
              selectedCurrency
            )
          );
          newIncomeData.push(
            convertCurrency(
              rate,
              timespanIncomeData[i],
              "EUR",
              selectedCurrency
            )
          );
          newAssetsData.push(
            convertCurrency(
              rate,
              timespanAssetsData[i],
              "EUR",
              selectedCurrency
            )
          );
        }

        timespanNetWorthData = newNetworthData;
        timespanExpenseData = newExpenseData;
        timespanIncomeData = newIncomeData;
        timespanAssetsData = newAssetsData;
      }

      setPlottedNetWorthData([
        {
          x: timespanDates,
          y: timespanNetWorthData,
          type: "scatter",
          mode: "lines+markers",
          name: "Net Worth",
        },
      ]);
    }
  }, [
    globalDates,
    globalNetWorthData,
    globalExpenseData,
    globalIncomeData,
    globalAssetsData,
    timespan,
    globalRates,
    selectedCurrency,
  ]);

  const renderTimespanButtons = () => {
    return (
      <div className="d-flex justify-content-end mb-3">
        {Object.keys(MONTHS).map((button) => (
          <button
            key={button}
            className={`btn btn-sm mr-2 ${
              timespan === button ? "btn-primary" : "btn-secondary"
            }`}
            style={{ margin: "0 5px" }}
            onClick={() => setTimespan(button)}
          >
            {button}
          </button>
        ))}
      </div>
    );
  };

  const renderPlot = () => {
    // Render the main plot with net worth data
    return (
      <Plot
        data={plottedNetWorthData}
        layout={{
          title: "Net Worth trend",
          xaxis: { title: "Date" },
          yaxis: { title: "Net Worth (" + CURRENCIES[selectedCurrency] + ")" },
        }}
        config={{ displayModeBar: false }}
        useResizeHandler
        style={{ width: "100%", height: "500px" }}
      />
    );
  };

  const renderLastMonthCard = () => {
    // Filter expenses and income for the last month
    const l1 = globalExpenseData.length;
    const l2 = globalIncomeData.length;
    const lastMonthExpenses =
      l1 > 0
        ? convertCurrency(
            globalRates,
            globalExpenseData[l1 - 1],
            "EUR",
            selectedCurrency,
            true
          )
        : .0;
    const lastMonthIncome =
      l2 > 0
        ? convertCurrency(
            globalRates,
            globalIncomeData[l2 - 1],
            "EUR",
            selectedCurrency,
            true
          )
        : .0;

    return (
      <Card>
        <Card.Body>
          <Card.Title style={{ textAlign: "center" }}>Last Month</Card.Title>
          <br></br>
          <div className="d-flex justify-content-between">
            <div>
              <span>Expenses: </span>
              <span style={{ color: "red" }}>
                {lastMonthExpenses.toFixed(2)}
                {CURRENCIES[selectedCurrency]}
              </span>
            </div>
            <div>
              <span>Income: </span>
              <span style={{ color: "green" }}>
                {lastMonthIncome.toFixed(2)}
                {CURRENCIES[selectedCurrency]}
              </span>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };

  const render1YearCard = () => {
    // Filter expenses and income for the last year (last 12 months)
    const maxMonths = Math.min(12, globalDates.length);
    const periodRates = globalDates
      .slice(-maxMonths)
      .map((date) => globalRates[date]);
    const last1YearExpenses =
      globalExpenseData.length > 0
        ? globalExpenseData
            .slice(-maxMonths)
            .map((value, index) =>
              convertCurrency(
                periodRates[index],
                parseFloat(value),
                "EUR",
                selectedCurrency
              )
            )
            .reduce((tot, x) => tot + x, .0)
        : .0;
    const last1YearIncome =
      globalIncomeData.length > 0
        ? globalIncomeData
            .slice(-maxMonths)
            .map((value, index) =>
              convertCurrency(
                periodRates[index],
                parseFloat(value),
                "EUR",
                selectedCurrency
              )
            )
            .reduce((tot, x) => tot + x, .0)
        : .0;

    return (
      <Card>
        <Card.Body>
          <Card.Title style={{ textAlign: "center" }}>Last Year</Card.Title>
          <div className="d-flex justify-content-between">
            <div>
              <span>Expenses: </span>
              <span style={{ color: "red" }}>
                {last1YearExpenses.toFixed(2)}
                {CURRENCIES[selectedCurrency]}
              </span>
            </div>
            <div>
              <span>Avg. monthly: </span>
              <span style={{ color: "red" }}>
                {(last1YearExpenses / 12).toFixed(2)}
                {CURRENCIES[selectedCurrency]}
              </span>
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <div>
              <span>Income: </span>
              <span style={{ color: "green" }}>
                {last1YearIncome.toFixed(2)}
                {CURRENCIES[selectedCurrency]}
              </span>
            </div>
            <div>
              <span>Avg. monthly: </span>
              <span style={{ color: "green" }}>
                {(last1YearIncome / 12).toFixed(2)}
                {CURRENCIES[selectedCurrency]}
              </span>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };

  return (
    <Container className="mt-3">
      {message ? (
        <Alert variant="danger">{message}. Try to refresh the page...</Alert>
      ) : (
        <>
          {userData ? (
            <>
              <Container className="mt-3 dashboard-container">
                <div className="plot-container">
                  {renderTimespanButtons()}
                  {renderPlot()}
                </div>

                <Row className="mt-4">
                  <Col md={6}>{renderLastMonthCard()}</Col>
                  <Col md={6}>{render1YearCard()}</Col>
                </Row>
              </Container>
            </>
          ) : (
            <div className="spinner-container">
              <div className="spinner"></div>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default Dashboard;
