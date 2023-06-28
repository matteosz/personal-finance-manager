import React from 'react'
import styled from 'styled-components'

const IncomeText = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 50px;
    height: 70vh;
`

const Income: React.FunctionComponent = () => {
    return (
        <IncomeText>Team</IncomeText>
    )
}

export default Income