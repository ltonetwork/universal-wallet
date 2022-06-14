import { BarCodeScanner } from 'expo-barcode-scanner'
import React, { useEffect, useState } from 'react'
import { Button } from 'react-native-paper'
import { StyledText, StyledScanner } from '../components/styles/ScanScreen.styles'
import { Text } from 'react-native-paper'
import { RootStackScreenProps } from '../types'

export default function ScanScreen({ navigation }: RootStackScreenProps<'Scan'>) {
    const [isLoading, setIsLoading] = useState(true)
    const [scanData, setScanData] = useState()
    const [permission, setPermission] = useState(true)

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
                <Text>There's been an error... try again</Text>
                <Button onPress={() => setScanData(undefined)}>
                    Scan Again
                </Button>
            </>
        )
    }

    if (permission) {
        return (
            <>
                <StyledScanner
                    onBarCodeScanned={({ type, data }) => {
                        try {
                            setScanData({ type, data })
                            navigation.navigate('Import2', { data: data })
                        } catch (err) {
                            console.log(err)
                        }
                    }}
                >
                    <StyledText title >QR Scanner</StyledText>
                    <StyledText >Scan the QR code from LTO's web application to import your wallet into your mobile phone</StyledText>
                </StyledScanner>

            </>
        )
    } else {
        return <Text>Permission denied</Text>
    }
}