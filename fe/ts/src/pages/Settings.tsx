import React from 'react'
import styled from 'styled-components'

const SettingsText = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 50px;
    height: 70vh;
`

const Settings: React.FunctionComponent = () => {
    return (
        <SettingsText>Settings</SettingsText>
    )
}

export default Settings
