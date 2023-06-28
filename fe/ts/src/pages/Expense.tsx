import React from 'react'
import styled from 'styled-components'

const ExpenseText = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 50px;
    height: 70vh;
`

const Expenses: React.FunctionComponent = () => {
    return (
        <ExpenseText>Expenses</ExpenseText>
    )
}

export default Expenses
