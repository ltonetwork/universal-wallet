import { BarCodeScanner } from 'expo-barcode-scanner'
import React, { useEffect, useState } from 'react'
import { Button, Text } from 'react-native-paper'
import { StyledScanner, StyledText } from '../components/styles/ScanScreen.styles'
import LocalStorageService from '../services/LocalStorage.service'
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
                <Text>{scanData}</Text>
                <Button onPress={() => console.log('yeii')}>
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
                                .storeData('storageKey', data)
                            console.log(type)
                            console.log('DATA:', data)
                            setScanData(data)
                            console.log('SCANDATA:', scanData)
                            navigation.navigate('Import2')
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