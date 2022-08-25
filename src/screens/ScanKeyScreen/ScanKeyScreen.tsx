import { BarCodeScanner } from 'expo-barcode-scanner'
import React, { useContext, useEffect, useState } from 'react'
import { Text } from 'react-native-paper'
import { RootStackScreenProps } from '../../../types'
import { CenteredView, StyledScanner, StyledText, ScannerContainer, TextContainer } from './ScanScreen.styles'
import { MessageContext } from '../../context/UserMessage.context'
import LocalStorageService from '../../services/LocalStorage.service'
import Spinner from '../../components/Spinner'


export default function ScanKeyScreen({ navigation }: RootStackScreenProps<'ScanKey'>) {
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
        if (permission) {
            handleQRScan
        }
    }, [])

    const { setShowMessage, setMessageInfo } = useContext(MessageContext)

    const handleQRScan = (input: any) => {
        if (input.includes('auth.lto.network')) {
            setIsLoading(true)
            const LTO = require("@ltonetwork/lto").LTO
            const lto = new LTO('T')
            const account = lto.account()
            const auth = input
            const signature = account.sign(`lto:sign:${auth.url}`).base58
            const data = { address: account.address, privateKey: account.privateKey, publicKey: account.publicKey, signature, seed: account.seed }
            if (data) {
                LocalStorageService.storeData('@accountData', data)
                    .then(() => {
                        setIsLoading(false)
                        navigation.navigate('ImportAccount')
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        } else {
            setMessageInfo('Invalid QR code!')
            setShowMessage(true)
            navigation.goBack()
        }
    }

    if (isLoading) {
        return (
            <CenteredView>
                <Spinner />
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
                        }
                        catch (err) {
                            console.log(err)
                        }
                    }}>
                </StyledScanner>
                <TextContainer>
                    <StyledText title >QR Scanner</StyledText>
                    <StyledText >Scan the QR code from LTO's web application to import your wallet into your mobile phone</StyledText>
                </TextContainer>
            </ScannerContainer>
        )
    } else {
        return (
            <CenteredView>
                <Text>Permission denied</Text>
            </CenteredView>
        )
    }
}