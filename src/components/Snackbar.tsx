
import React, { useState, useContext } from 'react'
import { MessageContext } from '../context/UserMessage.context'
import { SnackbarContainer, StyledSnackbar } from './styles/Snackbar.styles'


export default function SnackbarMessage() {

    const { showMessage, setShowMessage, messageInfo } = useContext(MessageContext)

    return (
        <SnackbarContainer>
            <StyledSnackbar
                visible={showMessage}
                duration={3000}
                onDismiss={() => setShowMessage(false)}>
                {messageInfo}
            </StyledSnackbar>
        </SnackbarContainer>
    )
}

