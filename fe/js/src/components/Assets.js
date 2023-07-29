import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Alert,
  Button,
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

import { addAsset, modifyAsset } from "../actions/user";
import {
  CURRENCIES,
  MONTHS,
  MONTHS_CARDINALITY,
  ASSET_CATEGORIES as CATEGORIES,
} from "../common/constants";
import { FormattedDate } from "../objects/FormattedDate";
import { convertCurrency } from "../objects/Currency";

import "./ComponentsStyles.css";

const today = new Date();
const defCurrency = "EUR";

const isTracked = (category) => {
  return ["Stocks", "Bonds", "Cryptos"].includes(category);
};

export const getAssetPrice = (asset, date, rates, currencyTo = "EUR") => {
  let price;
  if (isTracked(asset.category) && asset.pricesByDate[date] !== undefined) {
    price = asset.pricesByDate[date];
  } else {
    price = asset.amount;
  }
  return convertCurrency(
    rates[date],
    parseFloat(price),
    asset.currencyCode,
    currencyTo
  );
};

const Asset = () => {
  const dispatch = useDispatch();

  const [assetForm, setAssetForm] = useState({
    date: FormattedDate(today),
    currencyCode: defCurrency,
    category: "",
    identifierCode: "",
    description: "",
    amount: "",
    toBePurchased: false,
  });
  const [filters, setFilters] = useState({
    month: MONTHS[today.getMonth()],
    year: today.getFullYear(),
    category: "",
    currency: "",
    minAmount: "",
  });
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showAssets, setShowAssets] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { user: userData } = useSelector((state) => state.user);

  const [assetList, setAssetList] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [modifiedAsset, setModifiedAsset] = useState(null);
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
    if (type !== "checkbox") {
      setAssetForm((prevAssetForm) => ({
        ...prevAssetForm,
        [name]: value,
      }));
    } else {
      setAssetForm((prevAssetForm) => ({
        ...prevAssetForm,
        [name]: checked,
      }));
    }
  };

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setAssetForm((prevAssetForm) => ({
      ...prevAssetForm,
      category,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(addAsset(assetForm))
      .then(() => {
        setSuccessMessage("Asset added");
        setAssetForm({
          date: FormattedDate(today),
          currencyCode: defCurrency,
          category: "",
          identifierCode: "",
          description: "",
          amount: "",
          toBePurchased: false,
        });
        toggleForm(false);
      })
      .catch(() => {
        setErrorMessage("Error adding asset");
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
    setAssetForm({
      date: "",
      currencyCode: "",
      category: "",
      identifierCode: "",
      description: "",
      amount: "",
      toBePurchased: false,
    });
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const toggleAssets = () => {
    setShowAssets(!showAssets);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleModifyAsset = (asset) => {
    setModifiedAsset(asset);
    setIsModified(true);
  };

  const handleConfirmModification = () => {
    dispatch(modifyAsset(modifiedAsset))
      .then(() => {
        setSuccessMessage("Asset modified");
        setModifiedAsset(null);
        setIsModified(false);
      })
      .catch(() => {
        setErrorMessage("Error modifying asset");
      });
  };

  const handleDeleteModification = () => {
    setModifiedAsset(null);
    setIsModified(false);
  };

  const handleDeleteAsset = (asset) => {
    dispatch(modifyAsset(asset, true))
      .then(() => {
        setSuccessMessage("Asset deleted");
      })
      .catch(() => {
        setErrorMessage("Error deleting asset");
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
    const filteredAssets = userData.assets.filter((asset) => {
      const { date, currencyCode, category, amount } = asset;
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

    const sortedAssets = [...filteredAssets].sort((a, b) => {
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

    setAssetList(sortedAssets);
  }, [userData.assets, filters, sortBy, sortOrder]);

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
              <h5>Add Asset</h5>
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
                  value={assetForm.date}
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
                  value={assetForm.currencyCode}
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
                  value={assetForm.category}
                  onChange={handleCategoryChange}
                  required
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              {isTracked(assetForm.category) && (
                <Form.Group controlId="formIdentifier">
                  <Form.Label>Identifier Code</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={1}
                    name="identifier"
                    value={assetForm.identifierCode}
                    placeholder="Enter identifier code"
                    onChange={handleInputChange}
                    maxLength={50}
                    required
                  />
                </Form.Group>
              )}

              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={assetForm.description}
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
                  value={assetForm.purchasedAmount}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formToBePurchased">
                <Form.Check
                  type="checkbox"
                  name="toBePurchased"
                  label="To be purchased"
                  checked={assetForm.toBePurchased}
                  onChange={handleInputChange}
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
                  Add Asset
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
              <h5>View and Modify Assets</h5>
            </Col>
            <Col xs="auto">
              {showAssets ? (
                <Button variant="outline-primary" onClick={toggleAssets}>
                  <FaMinus />
                </Button>
              ) : (
                <Button variant="outline-danger" onClick={toggleAssets}>
                  <FaPlus />
                </Button>
              )}
            </Col>
          </Row>
        </Card.Header>

        {showAssets && (
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
                        {CATEGORIES.map((category) => (
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
                    <th>Identifier Code</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assetList.map((asset) => (
                    <tr key={asset.id}>
                      <td>
                        {isModified && modifiedAsset.id === asset.id ? (
                          <Form.Control
                            type="date"
                            name="date"
                            value={modifiedAsset.date}
                            min={userData.wallet.startDate}
                            onChange={(e) =>
                              setModifiedAsset((prevAsset) => ({
                                ...prevAsset,
                                date: e.target.value,
                              }))
                            }
                            required
                          />
                        ) : (
                          asset.date
                        )}
                      </td>
                      <td>
                        {isModified && modifiedAsset.id === asset.id ? (
                          <Form.Control
                            type="number"
                            name="amount"
                            value={modifiedAsset.amount}
                            step="0.01"
                            min="0"
                            onChange={(e) =>
                              setModifiedAsset((prevAsset) => ({
                                ...prevAsset,
                                purchasedAmount: e.target.value,
                              }))
                            }
                            required
                          />
                        ) : (
                          asset.amount.toFixed(2)
                        )}
                      </td>
                      <td>
                        {isModified && modifiedAsset.id === asset.id ? (
                          <Form.Control
                            as="select"
                            name="currencyCode"
                            value={modifiedAsset.currencyCode}
                            onChange={(e) =>
                              setModifiedAsset((prevAsset) => ({
                                ...prevAsset,
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
                          asset.currencyCode
                        )}
                      </td>
                      <td>
                        {isModified && modifiedAsset.id === asset.id ? (
                          <Form.Control
                            as="select"
                            name="category"
                            value={modifiedAsset.category}
                            onChange={(e) =>
                              setModifiedAsset((prevAsset) => ({
                                ...prevAsset,
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
                          asset.category
                        )}
                      </td>
                      <td>
                        {asset.identifierCode ? asset.identifierCode : ""}
                      </td>
                      <td>
                        {isModified && modifiedAsset.id === asset.id ? (
                          <Form.Control
                            as="textarea"
                            rows={2}
                            name="description"
                            value={modifiedAsset.description}
                            onChange={(e) =>
                              setModifiedAsset((prevAsset) => ({
                                ...prevAsset,
                                description: e.target.value,
                              }))
                            }
                            maxLength={100}
                            required
                          />
                        ) : (
                          asset.description
                        )}
                      </td>
                      <td>
                        {isModified && modifiedAsset.id === asset.id ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Button
                              variant="success"
                              onClick={() => handleConfirmModification(asset)}
                              style={{ marginRight: "10px" }}
                            >
                              <FaCheck />
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => handleDeleteModification(asset)}
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
                              onClick={() => handleModifyAsset(asset)}
                              style={{ marginRight: "10px" }}
                            >
                              <FaPencilAlt />
                            </Button>
                            <Button
                              variant="outline-danger"
                              onClick={() => handleDeleteAsset(asset)}
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

export default Asset;
