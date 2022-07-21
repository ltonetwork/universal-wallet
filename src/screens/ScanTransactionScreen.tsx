import { txFromData } from '@ltonetwork/lto'
import { BarCodeScanner } from 'expo-barcode-scanner'
import React, { useEffect, useState } from 'react'
import { Text } from 'react-native-paper'
import { RootStackScreenProps } from '../../types'
import { CenteredView, ScannerContainer, StyledScanner, StyledText } from '../components/styles/ScanScreen.styles'
import LocalStorageService from '../services/LocalStorage.service'
import SnackbarMessage from '../components/Snackbar'


export default function ScanTransactionScreen({ navigation }: RootStackScreenProps<'ScanTransaction'>) {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [permission, setPermission] = useState<boolean>(true)
    const [snackbarVisible, setSnackbarVisible] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')

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
            handleConfirmation
        }

    }, [])

    const handleConfirmation = async (input: any) => {
        try {
            const myAccount = await LocalStorageService.getData('@accountData')
            const LTO = require("@ltonetwork/lto").LTO
            const lto = new LTO('T')
            const account = lto.account({ seed: myAccount.seed })
            const transfer = JSON.parse(input)
            // JUST FOR TESTING PURPOSES
            transfer.sender = '3MuDkM9nu396vbmEvN6y7uqNPhot7s6ZVaL' // wrong sender
            transfer.timestamp = undefined
            transfer.recipient = "3NAuHWZ7hcyN6Yh7oEuzasTFXa95XMV9baV" // JAVI'S ACCOUNT test purposes
            transfer.amount = 500000000
            //

            if (transfer.sender !== account.address) {
                setSnackbarMessage('Sender address is not valid')
                setSnackbarVisible(true)
            } else {
                transfer.sender = undefined
                const transferObject = txFromData(transfer)
                const signedTransfer = transferObject.signWith(account)
                await lto.node.broadcast(signedTransfer)
                setSnackbarMessage('Transfer sent successfully')
                setSnackbarVisible(true)
            }
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
                            navigation.navigate('Root', { screen: 'Wallet' },)
                        }
                        catch (err) {
                            console.log(err)
                        }
                    }}>
                    <StyledText>QR Scanner</StyledText>
                    <StyledText >Scan the QR code from LTO's web application to import your wallet into your mobile phone</StyledText>
                    {snackbarVisible && <SnackbarMessage text={snackbarMessage} />}
                </StyledScanner>
            </ScannerContainer>
        )
    } else {
        return (
            <CenteredView>
                <Text>Permission denied!</Text>
            </CenteredView>
        )
    }
}
