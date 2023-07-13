import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, Card, Container, Form, Col, Row } from "react-bootstrap";
import { addExpense } from "../actions/user";
import { CURRENCIES } from "../objects/Currency";
import * as FaIcons from 'react-icons/fa' 

const CATEGORIES = {
  Housing: ["Rent", "Other"], 
  Transportation: ["Public transports", "Fuel", "Other"], 
  Social: ["Bar", "Restaurants", ], 
  Other: ["-"]
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

  const {user: userData} = useSelector(state => state.user);

  const [subCategories, setSubCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
    setSubCategories(getSubCategoriesByCategory(category));
  };

  const getSubCategoriesByCategory = (category) => {
    return CATEGORIES[category] || [];
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

  const toggleForm = (show) => {
    setShowForm(show);
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

  return (
    <Container className="mt-3">
      <h3 className="mb-4">Expense</h3>

      <Card>
        <Card.Header>
          <Row>
            <Col>
              <h5>Add Expense</h5>
            </Col>
            <Col xs="auto">
              {showForm ? (
                <Button variant="outline-primary" onClick={() => toggleForm(false)}>
                    <FaIcons.FaMinus />
                </Button>
              ) : (
                <Button variant="outline-danger" onClick={() => toggleForm(true)}>
                    <FaIcons.FaPlus />
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
                min={userData.netWorth.startDate}
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
                {/* Render currency options */}
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
                {/* Render category options */}
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
            {errorMessage && (
              <br></br>,
              <Alert variant="danger" className="mt-3">
                {errorMessage}
              </Alert>
            )}
          </Form>
          </Card.Body>
        )}
      </Card>
      {successMessage && (
        <Alert variant="success" className="mt-3">
          {successMessage}
        </Alert>
      )}
    </Container>
  );
};

export default Expense;