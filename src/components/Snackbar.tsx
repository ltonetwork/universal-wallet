
import React, { useContext } from 'react'
import { THREE_SECONDS_SNACK_DURATION } from '../constants/Quantities'
import { MessageContext } from '../context/UserMessage.context'
import { SnackbarContainer, StyledSnackbar } from './styles/Snackbar.styles'

export default function SnackbarMessage() {

    const { showMessage, setShowMessage, messageInfo } = useContext(MessageContext)

    return (
        <SnackbarContainer>
            <StyledSnackbar
                visible={showMessage}
                duration={THREE_SECONDS_SNACK_DURATION}
                onDismiss={() => setShowMessage(false)}>
                {messageInfo}
            </StyledSnackbar>
        </SnackbarContainer>
    )
}

