import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Carousel } from "react-bootstrap";

import './Home.css';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Home = () => {
  const [password, setPassword] = useState("");
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [hasClicked, setHasClicked] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!showModal && !isPasswordCorrect) {
      setHasClicked("");
    }
    if (isPasswordCorrect) {
      setShowModal(false);
      navigate(hasClicked);
      window.location.reload(false);
    }
  }, [showModal, isPasswordCorrect, hasClicked, navigate]);

  const handlePasswordSubmit = () => {
    if (password === process.env.REACT_APP_PWD) {
      setIsPasswordCorrect(true);
      localStorage.setItem("appPassword", password);
    }
  };

  const handleClick = (path) => {
    setHasClicked(path);
    if (!isPasswordCorrect) {
      setShowModal(true);
    }
  };

  const handleLoginClick = () => handleClick("/login");
  const handleSignupClick = () => handleClick("/register");

  const [email, setEmail] = useState('');

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="container">
          <div className="d-flex justify-content-end">
            <Button onClick={handleLoginClick} variant="primary" style={{marginRight: '20px'}}>Log In</Button>
            <Button onClick={handleSignupClick} variant="primary">Sign Up</Button>
          </div>
        </div>
      </header>
      <main className="landing-content">
        <section className="landing-section">
          <h1 className="display-3">Personal Finance Manager</h1>
          <p className="lead">
            Track your net worth, manage expenses, income, assets, and support
            multiple currencies, from any device.
          </p>
        </section>
        <section className="landing-section">
          <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/pfm.png"
                alt="Slide 1"
              />
              <Carousel.Caption>
                {"Main Dashboard tracking the net worth and general overall about expense and income. In the top right you can change the currency displayed by default in every page."}
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/expenses.png"
                alt="Slide 2"
              />
              <Carousel.Caption>
              {"List of expenses (income and assets are similar), that you can delete, modify and filter."}
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/expenses2.png"
                alt="Slide 3"
              />
              <Carousel.Caption>
              {"Pie chart for categories of expenses (income and assets are similar) by timespan. It's also possible to plot per category the pie chart of each subcategories"}
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/expenses3.png"
                alt="Slide 4"
              />
              <Carousel.Caption>
              {"Plot to track total expenses with category components across multiple timespans."}
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </section>
        <br></br>
        <section id="contact" className="contact">
          <div className="container">
            <h2 className="main-font">
              Request <span className="text-blue main-font">Access</span>
            </h2>
            <br></br>
            <form id="contact-form" data-aos="zoom-in" data-aos-delay="300" action="https://formspree.io/f/xwkdqqkd" method="POST">
              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="youremail@domain.com"
                  style={{width: '100%'}}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <br></br>  
              <Button variant="primary" type="submit">
                Send Request
              </Button>
            </form>
          </div>
        </section>
      </main>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Access Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handlePasswordSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;
