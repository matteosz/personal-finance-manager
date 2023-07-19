import React, { useState, useCallback, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import * as FaIcons from "react-icons/fa";
import styled from "styled-components";

import { SidebarData } from "./SidebarData";
import { Currency, convertCurrency } from "../objects/Currency";
import { logout } from "../actions/auth";
import { setCurrency } from "../actions/currency";
import { CURRENCIES } from "../common/constants";

const Navbar = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  height: 3.5rem;
  background-color: #000080;
`;

const MenuIconOpen = styled(Link)`
  display: flex;
  justify-content: start;
  font-size: 1.5rem;
  margin-left: 2rem;
  color: #ffffff;
`;

const MenuIconClose = styled(Link)`
  display: flex;
  justify-content: end;
  font-size: 1.5rem;
  margin-top: 0.75rem;
  margin-right: 1rem;
  color: #ffffff;
`;

const SidebarMenu = styled.div`
  width: 250px;
  height: 100vh;
  background-color: #000080;
  position: fixed;
  top: 0;
  left: ${({ $close }) => ($close ? "0" : "-100%")};
  transition: 0.6s;
  overflow-y: auto;
  z-index: 999;
`;

const MenuItems = styled.li`
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: start;
  width: 100%;
  height: 90px;
  padding: 1rem 0 1.25rem;
`;

const MenuNotPageItems = styled.p`
  display: flex;
  align-items: center;
  padding: 0 2rem;
  font-size: 18px;
  text-decoration: none;
  color: #ffffff;
`;

const MenuItemLinks = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0 2rem;
  font-size: 20px;
  text-decoration: none;
  color: #ffffff;

  &:hover {
    background-color: #ffffff;
    color: #000080;
    width: 100%;
    height: 45px;
  }
`;

const NavbarRight = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const CurrencyDropdown = styled.select`
  margin-left: 2rem;
  padding: 0.5rem;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  background-color: #ffffff;
  color: #000080;
`;

const NavBarItem = styled.div`
  display: flex;
  align-items: center;
  width: 50px;
`;

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [close, setClose] = useState(false);
  const sidebarRef = useRef(null);
  const showSidebar = (event) => {
    event.preventDefault();
    // Avoid the click event to propagate to the parent
    event.stopPropagation();
    setClose(!close);
  };

  const { currency: selectedCurrency } = useSelector((state) => state.currency);
  const {
    finance: { rates: globalRates, netWorth: globalNetWorthData },
  } = useSelector((state) => state.global);

  const [netWorth, setNetWorth] = useState(0);

  // Close the sidebar when clicking outside of it
  const handleOutsideClick = useCallback((event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setClose(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  // When the location changes then closes the sidebar (not working)
  useEffect(() => {
    setClose(false);
  }, [location]);

  useEffect(() => {
    if (globalNetWorthData && globalNetWorthData.length > 0) {
      // Calculate and update the net worth based on the user data
      const nwInEur = globalNetWorthData[globalNetWorthData.length - 1];
      setNetWorth(
        convertCurrency(globalRates, nwInEur, "EUR", selectedCurrency, true)
      );
    }
  }, [globalNetWorthData, globalRates, selectedCurrency]);

  const changeCurrency = (currency) => {
    // Convert from old to new currency the amount
    const newAmount = convertCurrency(
      globalRates,
      globalNetWorthData[globalNetWorthData.length - 1],
      "EUR",
      currency,
      true
    );

    // Update the currency
    setNetWorth(newAmount);
    dispatch(setCurrency(currency));
  };

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <>
      <Navbar>
        <MenuIconOpen to="#" onClick={showSidebar}>
          <FaIcons.FaBars />
        </MenuIconOpen>
        <NavbarRight>
          <CurrencyDropdown
            onChange={(event) => changeCurrency(event.target.value)}
            defaultValue={selectedCurrency}
          >
            {Object.keys(CURRENCIES).map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </CurrencyDropdown>

          <NavBarItem />
        </NavbarRight>
      </Navbar>

      <SidebarMenu $close={close} ref={sidebarRef}>
        <MenuIconClose to="#" onClick={showSidebar}>
          <FaIcons.FaTimes />
        </MenuIconClose>

        {SidebarData.map((item, index) => {
          if (item.title === "Exit") {
            return (
              <MenuItems key={index}>
                <MenuItemLinks to={item.path} onClick={logOut}>
                  {item.icon}
                  <span style={{ marginLeft: "16px" }}>{item.title}</span>
                </MenuItemLinks>
              </MenuItems>
            );
          } else if (item.title === "Current Net Worth") {
            return (
              <MenuNotPageItems key={index}>
                {item.icon}
                <span style={{ marginLeft: "16px" }}>
                  {item.title}
                  <br></br>
                  {Currency({ value: netWorth, code: selectedCurrency })}
                </span>
              </MenuNotPageItems>
            );
          }

          return (
            <MenuItems key={index}>
              <MenuItemLinks to={item.path}>
                {item.icon}
                <span style={{ marginLeft: "16px" }}>{item.title}</span>
              </MenuItemLinks>
            </MenuItems>
          );
        })}
      </SidebarMenu>
    </>
  );
};

export default Sidebar;
