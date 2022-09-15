import { txFromData } from '@ltonetwork/lto'
import { BarCodeScanner } from 'expo-barcode-scanner'
import React, { useContext, useEffect, useState } from 'react'
import { Text } from 'react-native-paper'
import { RootStackScreenProps } from '../../../types'
import ConfirmationDialog from '../../components/ConfirmationDialog'
import Spinner from '../../components/Spinner'
import {
    CenteredView,
    ScannerContainer,
    StyledScanner,
    StyledText,
    TextContainer,
} from '../../components/styles/Scanner.styles'
import { MessageContext } from '../../context/UserMessage.context'
import LocalStorageService from '../../services/LocalStorage.service'
import { confirmationMessage } from '../../utils/confirmationMessage'
import { TypedTransaction } from '../../interfaces/TypedTransaction'

export default function QrReader({ navigation }: RootStackScreenProps<'QrReader'>) {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [permission, setPermission] = useState<boolean>(true)
    const { setShowMessage, setMessageInfo } = useContext(MessageContext)
    const [scanned, setScanned] = useState(false)

    const [tx, setTx] = useState<TypedTransaction | undefined>()
    const [dialogVisible, setDialogVisible] = useState(false)

    useEffect(() => {
        requestCameraPermission()
    }, [permission])

    const requestCameraPermission = () => {
        BarCodeScanner.requestPermissionsAsync()
            .then(({ status }) => {
                status === 'granted' ? setPermission(true) : setPermission(false)
                setIsLoading(false)
            })
            .catch(() => {
                setPermission(false)
                setIsLoading(false)
            })
    }

    useEffect(() => {
        if (tx) {
            handleTx(tx)
        }
    }, [])

    const handleBarCodeScanned = ({ data }: any) => {
        setScanned(true)
        if (data.includes('http://schema.lto.network/simple-auth-v1.json')) {
            const auth = JSON.parse(data)
            return handleLogin(auth)
        } else {
            const _data = JSON.parse(data)
            setTx(_data)
            setDialogVisible(true)
        }
    }

    const handleLogin = async (auth: TypedTransaction) => {
        setIsLoading(true)
        try {
            const accountData = await LocalStorageService.getData('@accountData')
            const LTO = require('@ltonetwork/lto').LTO
            const lto = new LTO(process.env.LTO_NETWORK_ID || 'T')
            const account = lto.account({ seed: accountData[0].seed })
            const signature = account.sign(`lto:sign:${auth.url}`).base58
            const data = {
                address: account.address,
                keyType: 'ed25519',
                publicKey: account.publicKey,
                signature,
            }
            const axios = require('axios').default
            await axios.post(
                `${auth.url}`,
                {
                    address: data.address,
                    keyType: data.keyType,
                    publicKey: data.publicKey,
                    signature: signature,
                },
                { timeout: 5000 }
            )
            setMessageInfo(`Successful log in!`)
            setShowMessage(true)
        } catch (error) {
            setMessageInfo('Login failed: scan QR again!')
            setShowMessage(true)
        }
        setIsLoading(false)
        navigation.goBack()
    }

    const handleTx = async (data: TypedTransaction) => {
        setIsLoading(true)
        if (data?.type === 4) {
            try {
                const myAccount = await LocalStorageService.getData('@accountData')
                const LTO = require('@ltonetwork/lto').LTO
                const lto = new LTO(process.env.LTO_NETWORK_ID || 'T')
                const account = lto.account({ seed: myAccount[0].seed })

                if (tx?.sender !== account.address) {
                    setMessageInfo('Sender address is not valid!')
                    setShowMessage(true)
                } else {
                    if (tx != undefined) tx.sender = ''

                    const transferObject = tx && txFromData(tx)
                    const signedTransfer = transferObject?.signWith(account)
                    await lto.node.broadcast(signedTransfer)
                    setMessageInfo('Transfer sent successfully!')
                    setShowMessage(true)
                }
            } catch (error) {
                setMessageInfo('Transaction failed: try again!')
                setShowMessage(true)
            }
        }
        setIsLoading(false)
        navigation.goBack()
    }


    if (isLoading) {
        return <Spinner />
    }

    if (permission) {
        return (
            <ScannerContainer>
                <StyledScanner onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} />
                <TextContainer>
                    <StyledText title>QR Scanner</StyledText>
                    <StyledText>
                        Scan the QR code from LTO's web application to confirm your transfer with your mobile phone
                    </StyledText>
                </TextContainer>
                {tx?.sender ? (
                    <ConfirmationDialog
                        visible={dialogVisible}
                        message={confirmationMessage(tx)}
                        cancelPress={() => navigation.goBack()}
                        onPress={() => handleTx(tx)}
                    />
                ) : null}
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
