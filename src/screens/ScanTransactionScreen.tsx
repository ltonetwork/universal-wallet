import { txFromData } from '@ltonetwork/lto'
import { BarCodeScanner } from 'expo-barcode-scanner'
import React, { useEffect, useState } from 'react'
import { Text } from 'react-native-paper'
import { RootStackScreenProps } from '../../types'
import { CenteredView, ScannerContainer, StyledScanner, StyledText } from '../components/styles/ScanScreen.styles'
import LocalStorageService from '../services/LocalStorage.service'


export default function ScanTransactionScreen({ navigation }: RootStackScreenProps<'ScanTransaction'>) {
    const [isLoading, setIsLoading] = useState<boolean>(true)
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
        if (permission)
            handleConfirmation
    }, [])

    const handleConfirmation = async (input: any) => {
        try {
            const myAccount = await LocalStorageService.getData('@accountData')
            const LTO = require("@ltonetwork/lto").LTO
            const lto = new LTO('T')
            const account = lto.account({ seed: myAccount.seed })
            const transfer = JSON.parse(input)
            const transferObject = txFromData(transfer)
            const signedTransfer = transferObject.signWith(account)
            await lto.node.broadcast(signedTransfer)
        } catch (error) {
            console.log(error)
        }
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
                            handleConfirmation(data)
                            navigation.goBack()
                        }
                        catch (err) {
                            console.log(err)
                        }
                    }}>
                    <StyledText>QR Scanner</StyledText>
                    <StyledText >Scan the QR code from LTO's web application to import your wallet into your mobile phone</StyledText>
                </StyledScanner>
            </ScannerContainer>
        )
    }
}