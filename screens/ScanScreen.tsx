import React, { useEffect, useState } from 'react'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { Text, StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'

export default function ScanScreen({ navigation }) {
    const [isLoading, setIsLoading] = useState(true)
    const [scanData, setScanData] = useState()
    const [permission, setPermission] = useState(true)

    // const factory = require('@ltonetwork/lto').AccountFactoryED25519
    // const account = new factory('T').createFromPrivateKey(scanData.data)

    useEffect(() => {
        requestCameraPermission()
    }, [])

    const requestCameraPermission = () => {
        BarCodeScanner.requestPermissionsAsync()
            .then(({ status }) => {
                status === 'granted' ? setPermission(true) : setPermission(false)
                setIsLoading(false)
            })
            .catch(err => {
                setPermission(false)
                setIsLoading(false)
                console.log(err)
            })
    }

    if (isLoading) {
        return <Text>Requesting permission...</Text>
    }

    if (scanData) {
        return (
            <>

                <Text>{scanData.data}</Text>
                <Button onPress={() => setScanData(undefined)}>
                    Scan Again
                </Button>
            </>
        )
    }

    if (permission) {
        return (
            <BarCodeScanner
                style={[styles.container]}
                onBarCodeScanned={({ type, data }) => {
                    try {
                        setScanData({ type, data })
                        navigation.navigate('Import2', { data: data })
                    } catch (err) {
                        console.log(err)
                    }
                }}
            >
                <Text style={styles.text}>Scan the QR code from LTO's web application to import your wallet into your mobile phone</Text>
            </BarCodeScanner>
        )
    } else {
        return <Text>Permission denied</Text>
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        marginTop: -500,
        backgroundColor: 'black',
        color: 'white'
    },
    textError: {
        color: 'red'
    }
})
