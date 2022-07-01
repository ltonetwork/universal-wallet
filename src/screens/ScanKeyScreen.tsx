import { BarCodeScanner } from 'expo-barcode-scanner'
import React, { useEffect, useState } from 'react'
import { Button, Text } from 'react-native-paper'
import { StyledScanner, StyledText } from '../components/styles/ScanScreen.styles'
import LocalStorageService from '../services/LocalStorage.service'
import { RootStackScreenProps } from '../../types'
import { CenteredView } from '../components/styles/ScanScreen.styles'


export default function ScanKeyScreen({ navigation }: RootStackScreenProps<'ScanKey'>) {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [scanData, setScanData] = useState<string>()
    const [permission, setPermission] = useState<boolean>(true)

    useEffect(() => {
        requestCameraPermission()
    }, [permission])

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

    useEffect(() => {
        handleQRScan
    }, [scanData])

    const handleQRScan = (input: any) => {
        LocalStorageService
            .storeData('@appAuth', input)
        setScanData(input)
        console.log('scanned data:', input)
        navigation.navigate('ImportSeed')
    }



    if (isLoading) {
        return (
            <CenteredView>
                <Text>Requesting permission...</Text>
            </CenteredView>
        )
    }

    // if (scanData) {
    //     return (
    //         <CenteredView>
    //             <Text>Your key: {scanData}</Text>
    //             <Button onPress={() => setScanData(undefined)}>
    //                 Scan Again
    //             </Button>
    //         </CenteredView>
    //     )
    // }

    if (permission) {
        return (
            <>
                <StyledScanner
                    onBarCodeScanned={({ type, data }) => {
                        try {
                            handleQRScan(data)
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