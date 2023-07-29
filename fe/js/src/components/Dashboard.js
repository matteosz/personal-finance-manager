import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Alert, Card, Col, Container, Row } from "react-bootstrap";
import Plot from "react-plotly.js";
import { Chart } from "react-google-charts";

import { getAssetPrice } from "./Assets";
import { FormattedDate } from "../objects/FormattedDate";
import { convertCurrency } from "../objects/Currency";
import {
  CURRENCIES,
  MONTHS_TIMESPAN_NW as MONTHS,
  MONTHS_FROM_MS,
} from "../common/constants";

import "./ComponentsStyles.css";

const Dashboard = () => {
  const { message } = useSelector((state) => state.message);
  const { user: userData } = useSelector((state) => state.user);
  const { currency: selectedCurrency } = useSelector((state) => state.currency);
  const { netWorth } = useSelector((state) => state.global);

  const [currentState, setCurrentState] = useState({});
  const [currencyDistributionData, setCurrencyDistributionData] = useState([]);
  const [timespan, setTimespan] = useState("3M");
  const [plottedNetWorthData, setPlottedNetWorthData] = useState([]);

  useEffect(() => {
    if (netWorth.length === 0) {
      return;
    }

    const timespanMonths = Math.min(MONTHS[timespan], netWorth.length);
    const timespanNetWorth = netWorth.slice(-timespanMonths);

    const dates = [];
    const today = new Date();
    for (let i = 0; i < timespanMonths; ++i) {
      const date = new Date(today.getFullYear(), today.getMonth() - i);
      dates.push(FormattedDate(date));
    }

    setPlottedNetWorthData([
      {
        x: dates.reverse(),
        y: timespanNetWorth,
        type: "scatter",
        mode: "lines+markers",
        name: "Net Worth",
      },
    ]);
  }, [netWorth, timespan]);

  // Compute the data to be plotted as a slice of the global history whenever the timespan changes
  useEffect(() => {
    if (!userData) {
      return;
    }
    const { lastRates, expenses, income, assets, wallet } = userData;

    const startDate = new Date(wallet.startDate);
    const maxMonths = Math.floor((new Date() - startDate) / MONTHS_FROM_MS);

    const bucketedExpenses = [];
    const bucketedIncome = [];
    const bucketedAssets = [];
    const initialYear = startDate.getFullYear();
    const initialMonth = startDate.getMonth();
    for (let i = 0; i <= maxMonths; ++i) {
      const year = initialYear + Math.floor(i / 12);
      const month = (initialMonth + i) % 12;

      const currentMonth = new Date(year, month);
      const formattedDate = FormattedDate(currentMonth);

      const monthExpenses = expenses
        .filter((expense) => {
          const expenseDate = new Date(expense.date);
          return (
            expenseDate.getFullYear() === year &&
            expenseDate.getMonth() === month
          );
        })
        .map((expense) => {
          return convertCurrency(
            lastRates[formattedDate],
            parseFloat(expense.amount),
            expense.currencyCode,
            selectedCurrency
          );
        })
        .reduce((total, amount) => total + amount, 0.0);
      bucketedExpenses.push(monthExpenses);

      const monthIncome = income
        .filter((income) => {
          const incomeDate = new Date(income.date);
          return (
            incomeDate.getFullYear() === year && incomeDate.getMonth() === month
          );
        })
        .map((income) => {
          return convertCurrency(
            lastRates[formattedDate],
            parseFloat(income.amount),
            income.currencyCode,
            selectedCurrency
          );
        })
        .reduce((total, amount) => total + amount, 0.0);
      bucketedIncome.push(monthIncome);

      const monthAssets = assets.reduce((total, asset) => {
        return (
          total +
          getAssetPrice(asset, formattedDate, lastRates, selectedCurrency)
        );
      }, 0.0);
      bucketedAssets.push(monthAssets);
    }

    setCurrentState({
      rates: lastRates,
      expenses: bucketedExpenses,
      income: bucketedIncome,
      assets: bucketedAssets,
    });

    // Calculate currency distribution
    const currencyDistribution = [];
    const today = new Date();
    const formattedToday = FormattedDate(
      new Date(today.getFullYear(), today.getMonth())
    );

    Object.entries(wallet.keyPoints[formattedToday]).forEach(
      ([currency, amount]) => {
        const formattedAmount = parseFloat(amount);
        if (formattedAmount === 0.0) {
          return;
        }
        const convertedAmount = convertCurrency(
          lastRates[formattedToday],
          formattedAmount,
          currency,
          selectedCurrency
        );
        currencyDistribution.push([currency, convertedAmount]);
      }
    );

    setCurrencyDistributionData([
      ["Currency", "Amount (" + CURRENCIES[selectedCurrency] + ")"],
      ...currencyDistribution,
    ]);
  }, [userData, selectedCurrency]);

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
    if (
      currentState === {} ||
      currentState.expenses === undefined ||
      currentState.income === undefined
    ) {
      return <div></div>;
    }
    // Filter expenses and income for the last month
    const l1 = currentState.expenses.length;
    const l2 = currentState.income.length;
    const lastMonthExpenses = l1 > 0 ? currentState.expenses[l1 - 1] : 0.0;
    const lastMonthIncome = l2 > 0 ? currentState.income[l2 - 1] : 0.0;

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
    if (
      currentState === {} ||
      currentState.expenses === undefined ||
      currentState.income === undefined
    ) {
      return <div></div>;
    }
    // Filter expenses and income for the last year (last 12 months)
    const maxMonthsExp = Math.min(12, currentState.expenses.length);
    const maxMonthsInc = Math.min(12, currentState.income.length);

    const last1YearExpenses =
      currentState.expenses.length > 0
        ? currentState.expenses
            .slice(-maxMonthsExp)
            .reduce((tot, x) => tot + x, 0.0)
        : 0.0;
    const last1YearIncome =
      currentState.income.length > 0
        ? currentState.income
            .slice(-maxMonthsInc)
            .reduce((tot, x) => tot + x, 0.0)
        : 0.0;

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

  const renderCurrencyDistributionChart = () => {
    return (
      <Chart
        chartType="PieChart"
        data={currencyDistributionData}
        options={{
          title: "Current Currency Distribution",
          pieHole: 0.4,
        }}
        width={"100%"}
        height={"400px"}
      />
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

                <Row className="mt-4">
                  <Col md={12}>{renderCurrencyDistributionChart()}</Col>
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
