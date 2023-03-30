import React from 'react'
import { Button, Dialog, Paragraph, Portal, Provider } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ButtonContainer } from './styles/ConfirmationDialog.styles'


export default function ConfirmationDialog(props: {
    visible: boolean,
    message: string,
    onCancel: () => void,
    onPress: () => void
}): JSX.Element {

    return (
        <Portal>
            <Dialog
                visible={props.visible}
                onDismiss={props.onCancel}
            >
                <Dialog.Title testID='dialog'>Confirm:</Dialog.Title>
                <Dialog.Content>
                    <Paragraph>{props.message}</Paragraph>
                </Dialog.Content>
                <ButtonContainer>
                    <Dialog.Actions>
                        <Button testID='cancel' onPress={props.onCancel}>Cancel</Button>
                    </Dialog.Actions>
                    <Dialog.Actions>
                        <Button testID='continue' onPress={props.onPress}>Continue</Button>
                    </Dialog.Actions>
                </ButtonContainer>

            </Dialog>
        </Portal>
    )
}
