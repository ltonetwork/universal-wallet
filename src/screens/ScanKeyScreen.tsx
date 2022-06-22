import { BarCodeScanner } from 'expo-barcode-scanner'
import React, { useEffect, useState } from 'react'
import { Button, Text } from 'react-native-paper'
import { StyledScanner, StyledText } from '../components/styles/ScanScreen.styles'
import LocalStorageService from '../services/LocalStorage.service'
import { RootStackScreenProps } from '../../types'


export default function ScanKeyScreen({ navigation }: RootStackScreenProps<'ScanKey'>) {
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
                <Text>Your key: {scanData}</Text>
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
                            LocalStorageService
                                .storeData('@appKey', data)
                            setScanData(data)
                            navigation.navigate('Import2')
                            // navigation.navigate('Import', data)
                        } catch (err) {
                            setScanData(undefined)
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