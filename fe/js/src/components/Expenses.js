import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Alert, Button, Card, Container, Form, Col, Row, Table } from "react-bootstrap";
import { FaMinus, FaPlus, FaArrowUp, FaArrowDown, FaCheck, FaPencilAlt, FaTimes, FaTrash, FaEyeSlash, FaEye } from "react-icons/fa";

import { addExpense, modifyExpense } from "../actions/user";
import { CURRENCIES } from "../objects/Currency";

import "./ComponentsStyles.css";

const CATEGORIES = {
  Housing: ["Rent", "Other"], 
  Transportation: ["Public transports", "Fuel", "Other"], 
  Social: ["Bar", "Restaurants", ], 
  Other: ["-"]
};

const MONTHS = {
  "January": 0,
  "February": 1,
  "March": 2,
  "April": 3,
  "May": 4,
  "June": 5,
  "July": 6,
  "August": 7,
  "September": 8,
  "October": 9,
  "November": 10,
  "Dicember": 11,
};

const Expense = () => {
  const dispatch = useDispatch();

  const [expenseForm, setExpenseForm] = useState({
    date: "",
    currencyCode: "",
    category: "",
    subCategory: "",
    description: "",
    amount: "",
  });
  const [filters, setFilters] = useState({
    month: "",
    year: "",
    category: "",
    currency: "",
    minAmount: "",
  });
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showExpenses, setShowExpenses] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const {user: userData} = useSelector(state => state.user);

  const [expenses, setExpenses] = useState([]);

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
    const { name, value } = event.target;
    setExpenseForm((prevExpenseForm) => ({
      ...prevExpenseForm,
      [name]: value,
    }));
  };

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setExpenseForm((prevExpenseForm) => ({
      ...prevExpenseForm,
      category,
      subCategory: "",
    }));
    // Set subcategories based on the selected category
    setSubCategories(CATEGORIES[category]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(addExpense(expenseForm))
      .then(() => {
        setSuccessMessage("Expense added");
        setExpenseForm({
          date: "",
          currencyCode: "",
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
    const filteredExpenses = userData.expenses.filter((expense) => {
      const { date, currencyCode, category, amount } = expense;
      const { month, year, category: filterCategory, currency, minAmount } =
        filters;

      if (month && month !== "" && new Date(date).getMonth() !== MONTHS[month]) {
        return false;
      }

      if (year && new Date(date).getFullYear() !== parseInt(year)) {
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

    setExpenses(sortedExpenses);
  }, [userData, filters, sortBy, sortOrder, isModified, modifiedExpense]);

  return (
    <Container className="mt-3">
      {successMessage && (
        <Alert variant="success" className="mt-3">
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <br></br>,
        <Alert variant="danger" className="mt-3">
          {errorMessage}
        </Alert>
      )}

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
                  </Button>
                  {" "}
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
                min={userData.netWorth.startDate.slice(0, -2) + "01"}
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
                <Button variant="primary" type="submit" style={{ marginTop: "10px", position: "absolute", top: "50%",
                  left: "50%", msTransform: "translate(-50%, -50%)",
                  transform: "translate(-50%, -50%)" }}>
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
                <h6><b>Filters</b></h6>
              </Col>
              <Col xs="auto">
                <Button variant="outline-secondary" onClick={handleFilterReset}>
                  Clear
                </Button>
                {" "}
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
                        {Object.keys(MONTHS).map((month) => (
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
                    <Form.Group as={Col} sm={6} md={3} controlId="formMinAmount">
                      <Form.Label>Min Amount</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        min = "0"
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
                      {sortBy === "date" && (
                        <span>{sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />}</span>
                      )}
                    </th>
                    <th onClick={() => handleSortChange("amount")}>
                      Amount{" "}
                      {sortBy === "amount" && (
                        <span>{sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />}</span>
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
                  {expenses.map((expense) => (
                    <tr key={expense.id}>
                      <td>
                        {isModified && modifiedExpense.id === expense.id ? (
                          <Form.Control
                            type="date"
                            name="date"
                            value={modifiedExpense.date}
                            min={userData.netWorth.startDate}
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
                          {CATEGORIES[modifiedExpense.category].map((subCategory) => (
                            <option key={subCategory} value={subCategory}>
                              {subCategory}
                            </option>
                          ))}
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
                        <div style={{ display: "flex", justifyContent: "center" }}>
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
                        <div style={{ display: "flex", justifyContent: "center" }}>
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
    </Container>
  );
};

export default Expense;