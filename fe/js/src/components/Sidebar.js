import React, { useState, useCallback, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import * as FaIcons from "react-icons/fa";
import styled from "styled-components";

import { SidebarData } from "./SidebarData";
import { Currency, convertCurrency } from "../objects/Currency";
import { FormattedDate } from "../objects/FormattedDate";
import { logout } from "../actions/auth";
import { setCurrency } from "../actions/currency";
import { CURRENCIES } from "../common/constants";
import { setGlobalSetupState, setGlobalNetWorthState } from "../actions/global";

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

  const { user: userData } = useSelector((state) => state.user);
  const [close, setClose] = useState(false);
  const [netWorth, setNetWorth] = useState(0);
  const sidebarRef = useRef(null);

  const { currency: selectedCurrency } = useSelector((state) => state.currency);

  const showSidebar = (event) => {
    event.preventDefault();
    // Avoid the click event to propagate to the parent
    event.stopPropagation();
    setClose(!close);
  };

  const modifyNetWorth = () => {
    dispatch(setGlobalSetupState(true));
  };

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
    if (!userData || !userData.wallet) {
      return;
    }
    const startDate = new Date(userData.wallet.startDate);
    const today = new Date();
    const months =
      (today.getFullYear() - startDate.getFullYear()) * 12 +
      (today.getMonth() - startDate.getMonth());

    const bucketedNetWorth = [];
    const initialYear = startDate.getFullYear();
    const initialMonth = startDate.getMonth();
    for (let i = 0; i <= months; ++i) {
      const year = initialYear + Math.floor(i / 12);
      const month = (initialMonth + i) % 12;

      const currentMonth = new Date(year, month);
      const formattedDate = FormattedDate(currentMonth);

      const monthNetWorth = Object.entries(
        userData.wallet.keyPoints[formattedDate]
      ).reduce((total, [currency, amount]) => {
        return (
          total +
          convertCurrency(
            userData.lastRates[formattedDate],
            parseFloat(amount),
            currency,
            selectedCurrency
          )
        );
      }, 0.0);
      bucketedNetWorth.push(monthNetWorth);
    }

    setNetWorth(bucketedNetWorth[bucketedNetWorth.length - 1]);
    dispatch(setGlobalNetWorthState(bucketedNetWorth));
  }, [userData, selectedCurrency, dispatch]);

  const changeCurrency = (currency) => {
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
                <FaIcons.FaPencilAlt
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={modifyNetWorth}
                />
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
