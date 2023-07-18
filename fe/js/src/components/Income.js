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

import { addIncome, modifyIncome } from "../actions/user";
import {
  CURRENCIES,
  MONTHS,
  MONTHS_CARDINALITY,
  INCOME_CATEGORIES as CATEGORIES,
  MONTHS_FROM_MS,
  MONTHS_TIMESPAN,
} from "../common/constants";
import { Currency, convertCurrency } from "../objects/Currency";
import { FormattedDate1Month, FormattedDate } from "../objects/FormattedDate";

import "./ComponentsStyles.css";

const today = new Date();
const defCurrency = "EUR";
const defTImespan = "1M";
const defCategory = "Salary";

const Income = () => {
  const dispatch = useDispatch();

  const [incomeForm, setIncomeForm] = useState({
    date: FormattedDate(today),
    currencyCode: defCurrency,
    category: "",
    subCategory: "",
    description: "",
    amount: "",
    isRecurring: false,
    recurringMonths: 1,
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
  const [showincomes, setShowincomes] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryChart, setShowCategoryChart] = useState(true);

  const { user: userData } = useSelector((state) => state.user);
  const { currency: selectedCurrency } = useSelector((state) => state.currency);

  const [rates, setRates] = useState({});
  const [incomeList, setIncomeList] = useState([]);
  const [globalIncomeData, setGlobalIncomeData] = useState([]);

  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState({
    chart: [],
    tot: 0,
  });

  const [subCategories, setSubCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [modifiedIncome, setModifiedIncome] = useState(null);
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
      setIncomeForm((prevIncomeForm) => ({
        ...prevIncomeForm,
        [name]: value,
      }));
    } else {
      // Handle checkbox
      setIncomeForm((prevIncomeForm) => ({
        ...prevIncomeForm,
        [name]: checked,
      }));
    }
  };

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setIncomeForm((prevIncomeForm) => ({
      ...prevIncomeForm,
      category,
      subCategory: "",
    }));
    setSubCategories(CATEGORIES[category]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Process the recurring income data if it is set
    let incomesToAdd = [];
    if (incomeForm.isRecurring) {
      const startDate = new Date(incomeForm.date);
      for (let i = 0; i < incomeForm.recurringMonths; i++) {
        const currentMonth = new Date(startDate);
        currentMonth.setMonth(startDate.getMonth() + i);
        incomesToAdd.push({
          ...incomeForm,
          date: FormattedDate(currentMonth),
        });
      }
    } else {
      incomesToAdd.push(incomeForm);
    }

    dispatch(addIncome(incomesToAdd))
      .then(() => {
        setSuccessMessage("Income added");
        setIncomeForm({
          date: FormattedDate(today),
          currencyCode: defCurrency,
          category: "",
          subCategory: "",
          description: "",
          amount: "",
          isRecurring: false,
          recurringMonths: 1,
        });
        toggleForm(false);
      })
      .catch(() => {
        setErrorMessage("Error adding income");
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
    setIncomeForm({
      date: "",
      currencyCode: "",
      category: "",
      subCategory: "",
      description: "",
      amount: "",
      isRecurring: false,
      recurringMonths: 1,
    });
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const toggleincomes = () => {
    setShowincomes(!showincomes);
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

  const handleModifyincome = (income) => {
    setModifiedIncome(income);
    setIsModified(true);
  };

  const handleConfirmModification = () => {
    dispatch(modifyIncome(modifiedIncome))
      .then(() => {
        setSuccessMessage("income modified");
        setModifiedIncome(null);
        setIsModified(false);
      })
      .catch(() => {
        setErrorMessage("Error modifying income");
      });
  };

  const handleDeleteModification = () => {
    setModifiedIncome(null);
    setIsModified(false);
  };

  const handleDeleteincome = (income) => {
    dispatch(modifyIncome(income, true))
      .then(() => {
        setSuccessMessage("income deleted");
      })
      .catch(() => {
        setErrorMessage("Error deleting income");
      });
  };

  const preCalculateChartData = (date, incomes, lastRates) => {
    const startDate = new Date(date);
    const currentDate = new Date();
    const maxMonths = Math.floor((currentDate - startDate) / MONTHS_FROM_MS);

    const data = [];

    const initialYear = startDate.getFullYear();
    const initialMonth = startDate.getMonth();
    for (let i = 0; i <= maxMonths; ++i) {
      const year = initialYear + Math.floor(i / 12);
      const month = (initialMonth + i) % 12;

      const currentMonth = new Date(year, month);

      // Filter first by date
      const filteredincomesByDate = incomes.filter((income) => {
        const incomeDate = new Date(income.date);
        return (
          incomeDate.getFullYear() === year && incomeDate.getMonth() === month
        );
      });

      var totalMonth = 0.0;
      const categoryData = [];
      for (const category of Object.keys(CATEGORIES)) {
        const subCategories = [];
        var totalCat = 0.0;
        for (const subCategory of CATEGORIES[category]) {
          const subTotal = filteredincomesByDate
            .filter(
              (income) =>
                income.category === category &&
                income.subCategory === subCategory
            )
            .reduce(
              (total, income) =>
                total +
                convertCurrency(
                  lastRates[FormattedDate(currentMonth)],
                  parseFloat(income.amount),
                  income.currencyCode,
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

    setGlobalIncomeData(data);
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
    if (userData) {
      setRates(userData.lastRates);
      preCalculateChartData(
        userData.netWorth.startDate,
        userData.income,
        userData.lastRates
      );
      // Filter incomes for the table
      const filteredincomes = userData.income.filter((income) => {
        const { date, currencyCode, category, amount } = income;
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

      const sortedincomes = [...filteredincomes].sort((a, b) => {
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

      setIncomeList(sortedincomes);
    }
  }, [userData, filters, sortBy, sortOrder]);

  // Pie chart update
  useEffect(() => {
    if (globalIncomeData.length > 0) {
      const chart = [];
      const timespan = MONTHS_TIMESPAN[pieFilter.timespan];
      const maxLength = Math.min(timespan, globalIncomeData.length);
      const timespanData = globalIncomeData.slice(-maxLength);

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
      for (const monthincome of timespanData) {
        const date = FormattedDate(monthincome.date);
        for (const categoryData of monthincome.categoryData) {
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
        if (generalTotal !== 0) {
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
        if (categorySum !== 0) {
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
  }, [showCategoryChart, globalIncomeData, pieFilter, selectedCurrency, rates]);

  // General chart update
  useEffect(() => {
    if (globalIncomeData.length > 0) {
      const timespan = MONTHS_TIMESPAN[chartFilter.timespan];
      const maxLength = Math.min(timespan, globalIncomeData.length);
      const timespanData = globalIncomeData.slice(-maxLength);

      const chart = [["Date", ...Object.keys(CATEGORIES), "Total income"]];
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
  }, [globalIncomeData, chartFilter, selectedCurrency, rates]);

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
              <h5>Add Income</h5>
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
                  value={incomeForm.date}
                  min={FormattedDate1Month(userData.netWorth.startDate)}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formCurrencyCode">
                <Form.Label>Currency</Form.Label>
                <Form.Control
                  as="select"
                  name="currencyCode"
                  value={incomeForm.currencyCode}
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
                  value={incomeForm.category}
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
                  value={incomeForm.subCategory}
                  onChange={handleInputChange}
                  disabled={!incomeForm.category}
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
                  value={incomeForm.description}
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
                  value={incomeForm.amount}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formRecurring">
                <Form.Check
                  type="checkbox"
                  label="Recurring income"
                  name="isRecurring"
                  checked={incomeForm.isRecurring}
                  onChange={handleInputChange}
                />
              </Form.Group>

              {incomeForm.isRecurring && (
                <Form.Group controlId="formRecurringMonths">
                  <Form.Label>Recurring for how many months</Form.Label>
                  <Form.Control
                    type="number"
                    name="recurringMonths"
                    min="1"
                    max="12"
                    value={incomeForm.recurringMonths}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              )}

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
                  Add income
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
              <h5>View and Modify Incomes</h5>
            </Col>
            <Col xs="auto">
              {showincomes ? (
                <Button variant="outline-primary" onClick={toggleincomes}>
                  <FaMinus />
                </Button>
              ) : (
                <Button variant="outline-danger" onClick={toggleincomes}>
                  <FaPlus />
                </Button>
              )}
            </Col>
          </Row>
        </Card.Header>

        {showincomes && (
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
                        min="1900"
                        max="2200"
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
                  {incomeList.map((income) => (
                    <tr key={income.id}>
                      <td>
                        {isModified && modifiedIncome.id === income.id ? (
                          <Form.Control
                            type="date"
                            name="date"
                            value={modifiedIncome.date}
                            min={userData.netWorth.startDate}
                            onChange={(e) =>
                              setModifiedIncome((previncome) => ({
                                ...previncome,
                                date: e.target.value,
                              }))
                            }
                            required
                          />
                        ) : (
                          income.date
                        )}
                      </td>
                      <td>
                        {isModified && modifiedIncome.id === income.id ? (
                          <Form.Control
                            type="number"
                            name="amount"
                            value={modifiedIncome.amount}
                            step="0.01"
                            min="0"
                            onChange={(e) =>
                              setModifiedIncome((previncome) => ({
                                ...previncome,
                                amount: e.target.value,
                              }))
                            }
                            required
                          />
                        ) : (
                          income.amount.toFixed(2)
                        )}
                      </td>
                      <td>
                        {isModified && modifiedIncome.id === income.id ? (
                          <Form.Control
                            as="select"
                            name="currencyCode"
                            value={modifiedIncome.currencyCode}
                            onChange={(e) =>
                              setModifiedIncome((previncome) => ({
                                ...previncome,
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
                          income.currencyCode
                        )}
                      </td>
                      <td>
                        {isModified && modifiedIncome.id === income.id ? (
                          <Form.Control
                            as="select"
                            name="category"
                            value={modifiedIncome.category}
                            onChange={(e) =>
                              setModifiedIncome((previncome) => ({
                                ...previncome,
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
                          income.category
                        )}
                      </td>
                      <td>
                        {isModified && modifiedIncome.id === income.id ? (
                          <Form.Control
                            as="select"
                            name="subCategory"
                            value={modifiedIncome.subCategory}
                            onChange={(e) =>
                              setModifiedIncome((previncome) => ({
                                ...previncome,
                                category: e.target.value,
                              }))
                            }
                            disabled={!modifiedIncome.category}
                            required
                          >
                            {CATEGORIES[modifiedIncome.category].map(
                              (subCategory) => (
                                <option key={subCategory} value={subCategory}>
                                  {subCategory}
                                </option>
                              )
                            )}
                          </Form.Control>
                        ) : (
                          income.subCategory
                        )}
                      </td>
                      <td>
                        {isModified && modifiedIncome.id === income.id ? (
                          <Form.Control
                            as="textarea"
                            rows={2}
                            name="description"
                            value={modifiedIncome.description}
                            onChange={(e) =>
                              setModifiedIncome((previncome) => ({
                                ...previncome,
                                description: e.target.value,
                              }))
                            }
                            maxLength={100}
                            required
                          />
                        ) : (
                          income.description
                        )}
                      </td>
                      <td>
                        {isModified && modifiedIncome.id === income.id ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Button
                              variant="success"
                              onClick={() => handleConfirmModification(income)}
                              style={{ marginRight: "10px" }}
                            >
                              <FaCheck />
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => handleDeleteModification(income)}
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
                              onClick={() => handleModifyincome(income)}
                              style={{ marginRight: "10px" }}
                            >
                              <FaPencilAlt />
                            </Button>
                            <Button
                              variant="outline-danger"
                              onClick={() => handleDeleteincome(income)}
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
          <h5 style={{ textAlign: "center" }}>Report incomes by</h5>
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
                  title: "Incomes by category",
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
                    "Incomes for each sub-category of the selected category",
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
          <h5 style={{ textAlign: "center" }}>income Trend</h5>
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
                height={"600px"}
                width={"100%"}
                options={{
                  title: "Report of total income by each month",
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

export default Income;
