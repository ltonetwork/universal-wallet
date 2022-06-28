
import React, { useState } from 'react'
import { SnackbarContainer, StyledSnackbar } from './styles/Snackbar.styles'


export default function SnackbarMessage(props: { text: string }) {

    const [visible, setVisible] = useState(true)

    const onDismissSnackBar = () => setVisible(false)

    return (
        <SnackbarContainer>
            <StyledSnackbar
                visible={visible}
                duration={2000}
                onDismiss={onDismissSnackBar}>
                {props.text}
            </StyledSnackbar>
        </SnackbarContainer>
    )
}

