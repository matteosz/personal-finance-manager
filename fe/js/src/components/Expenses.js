import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Alert,
  Button,
  ButtonGroup,
  Card,
  Container,
  Form,
  Col,
  Row,
  Table,
} from "react-bootstrap";
import {
  FaMinus,
  FaPlus,
  FaArrowUp,
  FaArrowDown,
  FaCheck,
  FaPencilAlt,
  FaTimes,
  FaTrash,
  FaEyeSlash,
  FaEye,
} from "react-icons/fa";
import { Chart } from "react-google-charts";

import { addExpense, modifyExpense } from "../actions/user";
import {
  CURRENCIES,
  MONTHS,
  MONTHS_CARDINALITY,
  EXPENSE_CATEGORIES as CATEGORIES,
  MONTHS_TIMESPAN,
} from "../common/constants";
import {
  Currency,
  convertCurrency,
  findMinimumDate,
} from "../objects/Currency";
import { FormattedDate } from "../objects/FormattedDate";

import "./ComponentsStyles.css";

const today = new Date();
const defCurrency = "EUR";
const defTImespan = "1M";
const defCategory = "Housing";

const Expense = () => {
  const dispatch = useDispatch();

  const [expenseForm, setExpenseForm] = useState({
    date: FormattedDate(today),
    currencyCode: defCurrency,
    category: "",
    subCategory: "",
    description: "",
    amount: "",
  });
  const [filters, setFilters] = useState({
    month: MONTHS[today.getMonth()],
    year: today.getFullYear(),
    category: "",
    currency: "",
    minAmount: "",
  });
  const [pieFilter, setPieFilter] = useState({
    timespan: defTImespan,
    category: defCategory,
  });
  const [chartFilter, setChartFilter] = useState(defTImespan);

  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showExpenses, setShowExpenses] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryChart, setShowCategoryChart] = useState(true);

  const { user: userData } = useSelector((state) => state.user);
  const { currency: selectedCurrency } = useSelector((state) => state.currency);

  const [rates, setRates] = useState({});
  const [expenseList, setExpenseList] = useState([]);
  const [globalExpenseData, setGlobalExpenseData] = useState([]);

  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState({
    chart: [],
    tot: 0,
  });

  const [subCategories, setSubCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [modifiedExpense, setModifiedExpense] = useState(null);
  const [isModified, setIsModified] = useState(false);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    // Handle regular input fields
    if (type !== "checkbox") {
      setExpenseForm((prevExpenseForm) => ({
        ...prevExpenseForm,
        [name]: value,
      }));
    } else {
      // Handle checkbox
      setExpenseForm((prevExpenseForm) => ({
        ...prevExpenseForm,
        [name]: checked,
      }));
    }
  };

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setExpenseForm((prevExpenseForm) => ({
      ...prevExpenseForm,
      category,
      subCategory: "",
    }));
    setSubCategories(CATEGORIES[category]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    dispatch(addExpense(expenseForm))
      .then(() => {
        setSuccessMessage("Expense added");
        setExpenseForm({
          date: FormattedDate(today),
          currencyCode: defCurrency,
          category: "",
          subCategory: "",
          description: "",
          amount: "",
        });
        toggleForm(false);
      })
      .catch(() => {
        setErrorMessage("Error adding expense");
      });
  };

  const handleFilterReset = () => {
    setFilters({
      month: "",
      year: "",
      category: "",
      currency: "",
      minAmount: "",
    });
  };

  const clearForm = () => {
    setExpenseForm({
      date: "",
      currencyCode: "",
      category: "",
      subCategory: "",
      description: "",
      amount: "",
    });
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const toggleExpenses = () => {
    setShowExpenses(!showExpenses);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleTimespanChange = (event, pie) => {
    const timespan = event.target.value;
    if (pie) {
      setPieFilter((prevPieFilter) => ({
        ...prevPieFilter,
        timespan,
      }));
    } else {
      setChartFilter(timespan);
    }
  };

  const handleCategoryChangeForSubCategoryChart = (event) => {
    const selectedCategory = event.target.value;
    setPieFilter((prevPieFilter) => ({
      ...prevPieFilter,
      category: selectedCategory,
    }));
  };

  const handleModifyExpense = (expense) => {
    setModifiedExpense(expense);
    setIsModified(true);
  };

  const handleConfirmModification = () => {
    dispatch(modifyExpense(modifiedExpense))
      .then(() => {
        setSuccessMessage("Expense modified");
        setModifiedExpense(null);
        setIsModified(false);
      })
      .catch(() => {
        setErrorMessage("Error modifying expense");
      });
  };

  const handleDeleteModification = () => {
    setModifiedExpense(null);
    setIsModified(false);
  };

  const handleDeleteExpense = (expense) => {
    dispatch(modifyExpense(expense, true))
      .then(() => {
        setSuccessMessage("Expense deleted");
      })
      .catch(() => {
        setErrorMessage("Error deleting expense");
      });
  };

  const preCalculateChartData = (expenses, lastRates) => {
    const minimumDate = findMinimumDate(expenses);
    const startDate = minimumDate ? new Date(minimumDate) : new Date();
    const today = new Date();
    const months =
      (today.getFullYear() - startDate.getFullYear()) * 12 +
      (today.getMonth() - startDate.getMonth());

    const data = [];
    const initialYear = startDate.getFullYear();
    const initialMonth = startDate.getMonth();
    for (let i = 0; i <= months; ++i) {
      const year = initialYear + Math.floor(i / 12);
      const month = (initialMonth + i) % 12;

      const currentMonth = new Date(year, month);

      // Filter first by date
      const filteredExpensesByDate = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getFullYear() === year && expenseDate.getMonth() === month
        );
      });

      var totalMonth = 0.0;
      const categoryData = [];
      for (const category of Object.keys(CATEGORIES)) {
        const subCategories = [];
        var totalCat = 0.0;
        for (const subCategory of CATEGORIES[category]) {
          const subTotal = filteredExpensesByDate
            .filter(
              (expense) =>
                expense.category === category &&
                expense.subCategory === subCategory
            )
            .reduce(
              (total, expense) =>
                total +
                convertCurrency(
                  lastRates[FormattedDate(currentMonth)],
                  parseFloat(expense.amount),
                  expense.currencyCode,
                  "EUR"
                ),
              0.0
            );
          subCategories.push({
            subCategory,
            total: subTotal,
          });
          totalCat += subTotal;
        }
        categoryData.push({
          category,
          total: totalCat,
          subCategories,
        });
        totalMonth += totalCat;
      }

      data.push({
        date: currentMonth,
        total: totalMonth,
        categoryData: categoryData,
      });
    }

    setGlobalExpenseData(data);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
    return () => clearTimeout(timeout);
  }, [successMessage]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorMessage("");
    }, 3000);
    return () => clearTimeout(timeout);
  }, [errorMessage]);

  useEffect(() => {
    setRates(userData.lastRates);
    preCalculateChartData(userData.expenses, userData.lastRates);
    // Filter expenses for the table
    const filteredExpenses = userData.expenses.filter((expense) => {
      const { date, currencyCode, category, amount } = expense;
      const {
        month,
        year,
        category: filterCategory,
        currency,
        minAmount,
      } = filters;

      const objDate = new Date(date);

      if (
        month &&
        month !== "" &&
        objDate.getMonth() !== MONTHS_CARDINALITY[month]
      ) {
        return false;
      }

      if (year && objDate.getFullYear() !== parseInt(year)) {
        return false;
      }

      if (currency && currencyCode !== currency) {
        return false;
      }

      if (filterCategory && category !== filterCategory) {
        return false;
      }

      if (minAmount && parseFloat(amount) < parseFloat(minAmount)) {
        return false;
      }

      return true;
    });

    const sortedExpenses = [...filteredExpenses].sort((a, b) => {
      const fieldA = a[sortBy];
      const fieldB = b[sortBy];

      // Custom sort for date as string sorting doesn't work
      if (sortBy === "date") {
        const dateA = new Date(fieldA);
        const dateB = new Date(fieldB);
        if (dateA < dateB) {
          return sortOrder === "asc" ? -1 : 1;
        }
        if (dateA > dateB) {
          return sortOrder === "asc" ? 1 : -1;
        }
        return 0;
      }

      if (fieldA < fieldB) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (fieldA > fieldB) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });

    setExpenseList(sortedExpenses);
  }, [userData.lastRates, userData.expenses, filters, sortBy, sortOrder]);

  // Pie chart update
  useEffect(() => {
    if (globalExpenseData.length > 0) {
      const chart = [];
      const timespan = MONTHS_TIMESPAN[pieFilter.timespan];
      const maxLength = Math.min(timespan, globalExpenseData.length);
      const timespanData = globalExpenseData.slice(-maxLength);

      const generalTotal = timespanData.reduce(
        (total, monthData) =>
          total +
          convertCurrency(
            rates[FormattedDate(monthData.date)],
            monthData.total,
            "EUR",
            selectedCurrency
          ),
        0.0
      );

      const selectedCategory = pieFilter.category;
      const categories = {};
      const subCategories = {};
      for (const monthExpense of timespanData) {
        const date = FormattedDate(monthExpense.date);
        for (const categoryData of monthExpense.categoryData) {
          if (categoryData.category === selectedCategory) {
            for (const subCategoryData of categoryData.subCategories) {
              if (!(subCategoryData.subCategory in subCategories)) {
                subCategories[subCategoryData.subCategory] = {
                  name: subCategoryData.subCategory,
                  total: 0.0,
                };
              }
              subCategories[subCategoryData.subCategory].total +=
                convertCurrency(
                  rates[date],
                  subCategoryData.total,
                  "EUR",
                  selectedCurrency
                );
            }
          }
          if (!(categoryData.category in categories)) {
            categories[categoryData.category] = {
              name: categoryData.category,
              total: 0.0,
            };
          }
          categories[categoryData.category].total += convertCurrency(
            rates[date],
            categoryData.total,
            "EUR",
            selectedCurrency
          );
        }
      }

      if (showCategoryChart) {
        chart.push([
          "Category",
          "Amount (" + CURRENCIES[selectedCurrency] + ")",
        ]);
        if (generalTotal !== 0.0) {
          // See pie chart by category
          Object.entries(categories).forEach(([key, value]) => {
            chart.push([value.name, value.total]);
          });
        }
        const tot = Currency({ value: generalTotal, code: selectedCurrency });
        setPieData({ chart, tot });
      } else {
        // If the category sum is 0 then don't display anything
        chart.push([
          "Sub-category",
          "Amount (" + CURRENCIES[selectedCurrency] + ")",
        ]);
        const categorySum = categories[selectedCategory].total;
        if (categorySum !== 0.0) {
          Object.entries(subCategories).forEach(([key, value]) => {
            chart.push([value.name, value.total]);
          });
        }
        const tot = Currency({
          value: categories[selectedCategory].total,
          code: selectedCurrency,
        });
        setPieData({ chart, tot });
      }
    }
  }, [
    showCategoryChart,
    globalExpenseData,
    pieFilter,
    selectedCurrency,
    rates,
  ]);

  // General chart update
  useEffect(() => {
    if (globalExpenseData.length > 0) {
      const timespan = MONTHS_TIMESPAN[chartFilter];
      const maxLength = Math.min(timespan, globalExpenseData.length);
      const timespanData = globalExpenseData.slice(-maxLength);

      const chart = [["Date", ...Object.keys(CATEGORIES), "Total expense"]];
      timespanData.forEach((monthData) => {
        const row = [];
        const date = FormattedDate(monthData.date);
        row.push(date.slice(0, -3));
        monthData.categoryData.forEach((categoryData) => {
          row.push(
            convertCurrency(
              rates[date],
              categoryData.total,
              "EUR",
              selectedCurrency
            )
          );
        });
        row.push(
          convertCurrency(rates[date], monthData.total, "EUR", selectedCurrency)
        );

        chart.push(row);
      });

      setChartData(chart);
    }
  }, [globalExpenseData, chartFilter, selectedCurrency, rates]);

  return (
    <Container className="mt-3">
      {successMessage && (
        <Alert variant="success" className="mt-3">
          {successMessage}
        </Alert>
      )}
      {errorMessage &&
        ((<br></br>),
        (
          <Alert variant="danger" className="mt-3">
            {errorMessage}
          </Alert>
        ))}

      <Card>
        <Card.Header>
          <Row>
            <Col>
              <h5>Add Expense</h5>
            </Col>
            <Col xs="auto">
              {showForm ? (
                <div>
                  <Button variant="outline-secondary" onClick={clearForm}>
                    Clear
                  </Button>{" "}
                  <Button variant="outline-primary" onClick={toggleForm}>
                    <FaMinus />
                  </Button>
                </div>
              ) : (
                <Button variant="outline-danger" onClick={toggleForm}>
                  <FaPlus />
                </Button>
              )}
            </Col>
          </Row>
        </Card.Header>

        {showForm && (
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formDate">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={expenseForm.date}
                  min={userData.wallet.startDate}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formCurrencyCode">
                <Form.Label>Currency</Form.Label>
                <Form.Control
                  as="select"
                  name="currencyCode"
                  value={expenseForm.currencyCode}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select currency</option>
                  {Object.keys(CURRENCIES).map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formCategory">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  name="category"
                  value={expenseForm.category}
                  onChange={handleCategoryChange}
                  required
                >
                  <option value="">Select category</option>
                  {Object.keys(CATEGORIES).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formSubCategory">
                <Form.Label>Subcategory</Form.Label>
                <Form.Control
                  as="select"
                  name="subCategory"
                  value={expenseForm.subCategory}
                  onChange={handleInputChange}
                  disabled={!expenseForm.category}
                  required
                >
                  <option value="">Select subcategory</option>
                  {subCategories.map((subCategory) => (
                    <option key={subCategory} value={subCategory}>
                      {subCategory}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={expenseForm.description}
                  placeholder="Enter description"
                  onChange={handleInputChange}
                  maxLength={100}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formAmount">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="amount"
                  min="0"
                  placeholder="Enter amount"
                  value={expenseForm.amount}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <br></br>
              <div style={{ position: "relative" }}>
                <Button
                  variant="primary"
                  type="submit"
                  style={{
                    marginTop: "10px",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    msTransform: "translate(-50%, -50%)",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  Add Expense
                </Button>
              </div>
            </Form>
          </Card.Body>
        )}
      </Card>

      <Card className="mt-3">
        <Card.Header>
          <Row>
            <Col>
              <h5>View and Modify Expenses</h5>
            </Col>
            <Col xs="auto">
              {showExpenses ? (
                <Button variant="outline-primary" onClick={toggleExpenses}>
                  <FaMinus />
                </Button>
              ) : (
                <Button variant="outline-danger" onClick={toggleExpenses}>
                  <FaPlus />
                </Button>
              )}
            </Col>
          </Row>
        </Card.Header>

        {showExpenses && (
          <Card.Body>
            <Row>
              <Col>
                <h6>
                  <b>Filters</b>
                </h6>
              </Col>
              <Col xs="auto">
                <Button variant="outline-secondary" onClick={handleFilterReset}>
                  Clear
                </Button>{" "}
                <Button variant="outline-secondary" onClick={toggleFilters}>
                  {!showFilters ? <FaEye /> : <FaEyeSlash />}
                </Button>
              </Col>
            </Row>
            {showFilters && (
              <Form>
                <Form.Group controlId="formFilters">
                  <Row>
                    <Form.Group as={Col} sm={6} md={3} controlId="formMonth">
                      <Form.Label>Month</Form.Label>
                      <Form.Control
                        as="select"
                        name="month"
                        value={filters.month}
                        onChange={handleFilterChange}
                      >
                        <option value="">All</option>
                        {Object.keys(MONTHS_CARDINALITY).map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} sm={6} md={3} controlId="formYear">
                      <Form.Label>Year</Form.Label>
                      <Form.Control
                        type="number"
                        min="2000"
                        max="2100"
                        name="year"
                        value={filters.year}
                        onChange={handleFilterChange}
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm={6} md={3} controlId="formCategory">
                      <Form.Label>Category</Form.Label>
                      <Form.Control
                        as="select"
                        name="category"
                        value={filters.category}
                        onChange={handleFilterChange}
                      >
                        <option value="">All</option>
                        {Object.keys(CATEGORIES).map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} sm={6} md={3} controlId="formCurrency">
                      <Form.Label>Currency</Form.Label>
                      <Form.Control
                        as="select"
                        name="currency"
                        value={filters.currency}
                        onChange={handleFilterChange}
                      >
                        <option value="">All</option>
                        {Object.keys(CURRENCIES).map((currency) => (
                          <option key={currency} value={currency}>
                            {currency}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group
                      as={Col}
                      sm={6}
                      md={3}
                      controlId="formMinAmount"
                    >
                      <Form.Label>Min Amount</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        min="0"
                        name="minAmount"
                        value={filters.minAmount}
                        onChange={handleFilterChange}
                      />
                    </Form.Group>
                  </Row>
                </Form.Group>
              </Form>
            )}
            <br></br>
            <div style={{ overflowX: "auto" }}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th onClick={() => handleSortChange("date")}>
                      Date{" "}
                      {sortBy === "date" ? (
                        <span>
                          {sortOrder === "asc" ? (
                            <span>
                              <FaArrowUp />
                              <FaArrowDown style={{ color: "lightgray" }} />
                            </span>
                          ) : (
                            <span>
                              <FaArrowUp style={{ color: "lightgray" }} />
                              <FaArrowDown />
                            </span>
                          )}
                        </span>
                      ) : (
                        <span>
                          <FaArrowUp style={{ color: "lightgray" }} />
                          <FaArrowDown style={{ color: "lightgray" }} />
                        </span>
                      )}
                    </th>
                    <th onClick={() => handleSortChange("amount")}>
                      Amount{" "}
                      {sortBy === "amount" ? (
                        <span>
                          {sortOrder === "asc" ? (
                            <span>
                              <FaArrowUp />
                              <FaArrowDown style={{ color: "lightgray" }} />
                            </span>
                          ) : (
                            <span>
                              <FaArrowUp style={{ color: "lightgray" }} />
                              <FaArrowDown />
                            </span>
                          )}
                        </span>
                      ) : (
                        <span>
                          <FaArrowUp style={{ color: "lightgray" }} />
                          <FaArrowDown style={{ color: "lightgray" }} />
                        </span>
                      )}
                    </th>
                    <th>Currency</th>
                    <th>Category</th>
                    <th>Subcategory</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenseList.map((expense) => (
                    <tr key={expense.id}>
                      <td>
                        {isModified && modifiedExpense.id === expense.id ? (
                          <Form.Control
                            type="date"
                            name="date"
                            value={modifiedExpense.date}
                            min={userData.wallet.startDate}
                            onChange={(e) =>
                              setModifiedExpense((prevExpense) => ({
                                ...prevExpense,
                                date: e.target.value,
                              }))
                            }
                            required
                          />
                        ) : (
                          expense.date
                        )}
                      </td>
                      <td>
                        {isModified && modifiedExpense.id === expense.id ? (
                          <Form.Control
                            type="number"
                            name="amount"
                            value={modifiedExpense.amount}
                            step="0.01"
                            min="0"
                            onChange={(e) =>
                              setModifiedExpense((prevExpense) => ({
                                ...prevExpense,
                                amount: e.target.value,
                              }))
                            }
                            required
                          />
                        ) : (
                          expense.amount.toFixed(2)
                        )}
                      </td>
                      <td>
                        {isModified && modifiedExpense.id === expense.id ? (
                          <Form.Control
                            as="select"
                            name="currencyCode"
                            value={modifiedExpense.currencyCode}
                            onChange={(e) =>
                              setModifiedExpense((prevExpense) => ({
                                ...prevExpense,
                                currencyCode: e.target.value,
                              }))
                            }
                            required
                          >
                            {Object.keys(CURRENCIES).map((currency) => (
                              <option key={currency} value={currency}>
                                {currency}
                              </option>
                            ))}
                          </Form.Control>
                        ) : (
                          expense.currencyCode
                        )}
                      </td>
                      <td>
                        {isModified && modifiedExpense.id === expense.id ? (
                          <Form.Control
                            as="select"
                            name="category"
                            value={modifiedExpense.category}
                            onChange={(e) =>
                              setModifiedExpense((prevExpense) => ({
                                ...prevExpense,
                                category: e.target.value,
                              }))
                            }
                            required
                          >
                            {Object.keys(CATEGORIES).map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </Form.Control>
                        ) : (
                          expense.category
                        )}
                      </td>
                      <td>
                        {isModified && modifiedExpense.id === expense.id ? (
                          <Form.Control
                            as="select"
                            name="subCategory"
                            value={modifiedExpense.subCategory}
                            onChange={(e) =>
                              setModifiedExpense((prevExpense) => ({
                                ...prevExpense,
                                category: e.target.value,
                              }))
                            }
                            disabled={!modifiedExpense.category}
                            required
                          >
                            {CATEGORIES[modifiedExpense.category].map(
                              (subCategory) => (
                                <option key={subCategory} value={subCategory}>
                                  {subCategory}
                                </option>
                              )
                            )}
                          </Form.Control>
                        ) : (
                          expense.subCategory
                        )}
                      </td>
                      <td>
                        {isModified && modifiedExpense.id === expense.id ? (
                          <Form.Control
                            as="textarea"
                            rows={2}
                            name="description"
                            value={modifiedExpense.description}
                            onChange={(e) =>
                              setModifiedExpense((prevExpense) => ({
                                ...prevExpense,
                                description: e.target.value,
                              }))
                            }
                            maxLength={100}
                            required
                          />
                        ) : (
                          expense.description
                        )}
                      </td>
                      <td>
                        {isModified && modifiedExpense.id === expense.id ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Button
                              variant="success"
                              onClick={() => handleConfirmModification(expense)}
                              style={{ marginRight: "10px" }}
                            >
                              <FaCheck />
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => handleDeleteModification(expense)}
                            >
                              <FaTimes />
                            </Button>
                          </div>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Button
                              variant="outline-primary"
                              onClick={() => handleModifyExpense(expense)}
                              style={{ marginRight: "10px" }}
                            >
                              <FaPencilAlt />
                            </Button>
                            <Button
                              variant="outline-danger"
                              onClick={() => handleDeleteExpense(expense)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        )}
      </Card>

      <Card className="mt-3">
        <Card.Header>
          <h5 style={{ textAlign: "center" }}>Report expenses by</h5>
        </Card.Header>
        <ButtonGroup className="mt-3">
          <Button
            variant={showCategoryChart ? "primary" : "secondary"}
            onClick={() => setShowCategoryChart(true)}
          >
            Category
          </Button>
          <Button
            variant={!showCategoryChart ? "primary" : "secondary"}
            onClick={() => setShowCategoryChart(false)}
          >
            Subcategory
          </Button>
        </ButtonGroup>

        {showCategoryChart ? (
          <Card.Body>
            <Row>
              <Col sm={6} md={4}>
                <Form.Group controlId="timespanSelect">
                  <Form.Label>Timespan</Form.Label>
                  <Form.Control
                    as="select"
                    name="timespan"
                    value={pieFilter.timespan}
                    onChange={(event) => handleTimespanChange(event, true)}
                  >
                    {Object.keys(MONTHS_TIMESPAN).map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <div className="container mt-5">
              <Chart
                chartType="PieChart"
                data={pieData.chart}
                height={"500px"}
                options={{
                  title: "Expenses by category",
                  is3D: true,
                }}
              />
            </div>
            <div className="text-center mt-3">
              <h4>
                Total<br></br>
                <b>{pieData.tot}</b>
              </h4>
            </div>
          </Card.Body>
        ) : (
          <Card.Body>
            <Row>
              <Col sm={6} md={4}>
                <Form.Group controlId="timespanSelect">
                  <Form.Label>Timespan</Form.Label>
                  <Form.Control
                    as="select"
                    name="timespan"
                    value={pieFilter.timespan}
                    onChange={(event) => handleTimespanChange(event, true)}
                  >
                    {Object.keys(MONTHS_TIMESPAN).map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col sm={6} md={4}>
                <Form.Group controlId="categorySelect">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    as="select"
                    name="category"
                    value={pieFilter.category}
                    onChange={handleCategoryChangeForSubCategoryChart}
                  >
                    {Object.keys(CATEGORIES).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <div className="container mt-5">
              <Chart
                chartType="PieChart"
                data={pieData.chart}
                height={"500px"}
                options={{
                  title:
                    "Expenses for each sub-category of the selected category",
                  is3D: true,
                }}
              />
            </div>
            <div className="text-center mt-3">
              <h4>
                Total<br></br>
                <b>{pieData.tot}</b>
              </h4>
            </div>
          </Card.Body>
        )}
      </Card>

      <Card className="mt-3">
        <Card.Header>
          <h5 style={{ textAlign: "center" }}>Expense Trend</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col sm={6} md={4}>
              <Form.Group controlId="timespanSelect2">
                <Form.Label>Timespan</Form.Label>
                <Form.Control
                  as="select"
                  name="timespan"
                  value={chartFilter.timespan}
                  onChange={(event) => handleTimespanChange(event, false)}
                >
                  {Object.keys(MONTHS_TIMESPAN).map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <div className="container mt-5">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Chart
                chartType="ComboChart"
                data={chartData}
                height={"800px"}
                width={"100%"}
                options={{
                  title: "Report of total expenses by each month",
                  seriesType: "bars",
                  series: {
                    [Object.keys(CATEGORIES).length]: {
                      type: "line",
                    },
                  },
                  vAxes: {
                    0: {
                      title: "Amount (" + CURRENCIES[selectedCurrency] + ")",
                    },
                  },
                }}
                style={{ alignContent: "center" }}
              />
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Expense;
