import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from './components/Sidebar'

import Home from './pages/Home';
import Income from './pages/Income';
import Expenses from './pages/Expense';
import Assets from './pages/Assets';
import Settings from './pages/Settings';
import { checkExchangeRates } from './utilities/Currency';

const App: React.FunctionComponent = () => {
  checkExchangeRates();
  return (
    <>
      <Router>
        <Sidebar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/expense' element={<Expenses />} />  
          <Route path='/income' element={<Income />} />
          <Route path='/assets' element={<Assets />} />
          <Route path='/settings' element={<Settings />} />
        </Routes>
      </Router> 
    </>
  )
}

export default App