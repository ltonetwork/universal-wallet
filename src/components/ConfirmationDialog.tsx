import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Button, Dialog, Paragraph, Portal } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'


export default function ConfirmationDialog(props: {
    visible: boolean, message: string, onPress: () => void
}): JSX.Element {

    const [visible, setVisible] = useState(true)
    const hideDialog = () => setVisible(false)
    const navigation = useNavigation()

    return (
        <SafeAreaView>
            <Portal>
                <Dialog
                    visible={visible}
                    onDismiss={hideDialog}
                >
                    <Dialog.Title>Confirm transaction:</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>{props.message}</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => navigation.goBack()}>Cancel</Button>
                    </Dialog.Actions>
                    <Dialog.Actions>
                        <Button onPress={props.onPress}>Continue</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </SafeAreaView>
    )
}
