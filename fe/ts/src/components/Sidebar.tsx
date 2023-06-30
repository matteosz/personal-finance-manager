import React from 'react'
import { Link } from 'react-router-dom'
import * as FaIcons from 'react-icons/fa' 
import { SidebarData } from './SidebarData'
import { useState } from 'react'
import styled from 'styled-components'
import { Currency, convertCurrency } from '../utilities/Currency'

const Navbar = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
    height: 3.5rem;
    background-color: #000080;
`

const MenuIconOpen = styled(Link)`
    display: flex;
    justify-content: start;
    font-size: 1.5rem;
    margin-left: 2rem;
    color: #ffffff;
`

const MenuIconClose = styled(Link)`
    display: flex;
    justify-content: end;
    font-size: 1.5rem;
    margin-top: 0.75rem;
    margin-right: 1rem;
    color: #ffffff;
`

const SidebarMenu = styled.div<{close: boolean}>`
    width: 250px;
    height: 100vh;
    background-color: #000080;
    position: fixed;
    top: 0;
    left: ${({ close}) => close ? '0' : '-100%'};
    transition: .6s;
`

const MenuItems = styled.li`
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: start;
    width: 100%;
    height: 90px;
    padding: 1rem 0 1.25rem;
`

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
`

const HeaderSidebarLink = styled(Link)`
    display: flex;
    align-items: center;
    padding: 0 2rem;
    font-size: 18px;
    text-decoration: none;
    color: #ffffff;
`

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


const Sidebar: React.FunctionComponent = () => {
    const [close, setClose] = useState(false)
    const showSidebar = () => setClose(!close)

    const changeTheme = () => {
        console.log('change theme')
    }

    const [selectedCurrency, setSelectedCurrency] = useState('EUR');
    const [netWorth, setNetWorth] = useState(100000);

    const changeCurrency = (currency: string) => {
        const oldCurrency = selectedCurrency;

        // Convert from old to new currency the amount
        const newAmount = convertCurrency(netWorth, oldCurrency, currency);

        // Update the currency
        setNetWorth(newAmount);
        setSelectedCurrency(currency);
    };

    return (
        <>
            <Navbar>
                <MenuIconOpen to="#" onClick={showSidebar}>
                    <FaIcons.FaBars />
                </MenuIconOpen>
                <NavbarRight>

                <NavBarItem onClick={changeTheme}>
                    <FaIcons.FaSun style={{color: 'white'}}/>
                </NavBarItem>

                <CurrencyDropdown onChange={(event: React.ChangeEvent<HTMLSelectElement>) => changeCurrency(event.target.value)}>
                    <option value="CHF">CHF</option>
                    <option value="EUR" selected>EUR</option>
                    <option value="USD">USD</option>
                </CurrencyDropdown>

                <NavBarItem />

                </NavbarRight>
            </Navbar>

            <SidebarMenu close={close}>
                <MenuIconClose to="#" onClick={showSidebar}>
                    <FaIcons.FaTimes />
                </MenuIconClose>

                {SidebarData.map((item, index) => {
                    if (index === 0) {
                        return (
                            <MenuItems key={index}>
                                <HeaderSidebarLink to={item.path}>
                                    {item.icon}
                                    <span style={{marginLeft: '16px'}}><p>{item.title}</p>
                                    <p style={{paddingTop: '15px'}}>{Currency({value: netWorth, code: selectedCurrency})}</p></span>
                                </HeaderSidebarLink>
                            </MenuItems>
                        )
                    }
                    return (
                        <MenuItems key={index}>
                            <MenuItemLinks to={item.path}>
                                {item.icon}
                                <span style={{marginLeft: '16px'}}>{item.title}</span>
                            </MenuItemLinks>
                        </MenuItems>
                    )
                })}
            </SidebarMenu>
        </>
    )
}

export default Sidebar