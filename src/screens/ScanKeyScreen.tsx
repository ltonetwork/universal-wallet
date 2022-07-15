import { BarCodeScanner } from 'expo-barcode-scanner'
import React, { useEffect, useState } from 'react'
import { Text } from 'react-native-paper'
import { RootStackScreenProps } from '../../types'
import { CenteredView, StyledScanner, StyledText, ScannerContainer } from '../components/styles/ScanScreen.styles'
import LocalStorageService from '../services/LocalStorage.service'


export default function ScanKeyScreen({ navigation }: RootStackScreenProps<'ScanKey'>) {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [scanData, setScanData] = useState<any>()
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
        if (permission) {
            handleQRScan
        }
    }, [])

    const handleQRScan = (input: any) => {
        const LTO = require("@ltonetwork/lto").LTO
        const lto = new LTO('T')
        const account = lto.account()
        const auth = input
        const signature = account.sign(`lto:sign:${auth.url}`).base58
        const data = { address: account.address, privateKey: account.privateKey, publicKey: account.publicKey, signature, seed: account.seed }
        LocalStorageService.storeData('@accountData', data)
            .then(() => {
                navigation.navigate('ImportAccount')
            })
    }

    if (isLoading) {
        return (
            <CenteredView>
                <Text>Requesting permission...</Text>
            </CenteredView>
        )
    }

    if (permission) {
        return (
            <ScannerContainer>
                <StyledScanner
                    onBarCodeScanned={({ data }) => {
                        try {
                            handleQRScan(data)
                        } catch (err) {
                            console.log(err)
                        }
                    }}
                >
                    <StyledText title >QR Scanner</StyledText>
                    <StyledText >Scan the QR code from LTO's web application to import your wallet into your mobile phone</StyledText>
                </StyledScanner>

            </ScannerContainer>
        )
    } else {
        return <Text>Permission denied</Text>
    }
}