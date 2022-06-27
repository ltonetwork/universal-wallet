import React, { useState } from 'react'
import { Button, Snackbar } from 'react-native-paper'
import { View } from 'react-native'
import { StyleSheet } from 'react-native'


export default function SnackbarMessage(props: { text: string }) {

    const [visible, setVisible] = useState(true)

    const onDismissSnackBar = () => setVisible(false)

    return (
        <View style={styles.container}>
            <Snackbar
                visible={visible}
                duration={2000}
                style={{ backgroundColor: '#0092aa' }}
                onDismiss={onDismissSnackBar}>
                {props.text}
            </Snackbar>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        justifyContent: 'space-between',
        width: "100%",
        height: '85%'
    },
})

